import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Play, Pause, X, Volume2, Gauge, Square, AlertTriangle } from "lucide-react-native";
import { useNarration } from "../../hooks/useNarration";
import { isArabicTTSAvailable } from "../../services/audioService";

interface AudioPlayerProps {
  text: string;
  isDark: boolean;
  accentColor: string;
  onClose: () => void;
}

const toArabicNum = (n: number) =>
  String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5];

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  isDark,
  accentColor,
  onClose,
}) => {
  const { status, progress, settings, play, pause, stop, updateSettings } =
    useNarration(text);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [noArabicTTS, setNoArabicTTS] = useState(false);

  useEffect(() => {
    isArabicTTSAvailable().then((available) => {
      if (!available) setNoArabicTTS(true);
    });
  }, []);

  const pct = progress.total > 0 ? progress.current / progress.total : 0;

  const progressBarStyle = useAnimatedStyle(() => ({
    width: withTiming(`${pct * 100}%`, { duration: 300 }) as any,
  }));

  const handleClose = () => {
    stop();
    onClose();
  };

  return (
    <Animated.View
      entering={FadeIn.springify()}
      exiting={FadeOut}
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(18,16,23,0.98)"
            : "rgba(244,239,230,0.98)",
          borderColor: accentColor + "33",
        },
      ]}
    >
      {/* No Arabic TTS warning */}
      {noArabicTTS && (
        <View style={[styles.warningRow, { backgroundColor: isDark ? "rgba(234,179,8,0.12)" : "rgba(234,179,8,0.15)" }]}>
          <AlertTriangle color="#EAB308" size={13} />
          <Text style={[styles.warningText, { color: isDark ? "#FCD34D" : "#92400E" }]}>
            لم يُعثر على محرك TTS عربي. ثبّت "Google TTS" واللغة العربية من الإعدادات.
          </Text>
        </View>
      )}

      {/* Progress bar */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
        ]}
      >
        <Animated.View
          style={[styles.progressFill, { backgroundColor: accentColor }, progressBarStyle]}
        />
      </View>

      <View style={styles.controlsRow}>
        {/* Close button */}
        <TouchableOpacity
          onPress={handleClose}
          style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }]}
        >
          <X color={isDark ? "#E0D5C5" : "#3D2A1C"} size={18} />
        </TouchableOpacity>

        {/* Speed button */}
        <TouchableOpacity
          onPress={() => setSettingsOpen(true)}
          style={[styles.speedBtn, { borderColor: accentColor + "55" }]}
        >
          <Gauge color={accentColor} size={14} />
          <Text style={[styles.speedText, { color: accentColor }]}>
            {settings ? `${settings.rate}x` : "1.0x"}
          </Text>
        </TouchableOpacity>

        {/* Progress indicator */}
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: isDark ? "#9E91B0" : "#8A6F5A" }]}>
            {progress.total > 0
              ? `${toArabicNum(progress.current + 1)} / ${toArabicNum(progress.total)}`
              : "جاهز للقراءة"}
          </Text>
        </View>

        {/* Play/Pause main button */}
        <TouchableOpacity
          onPress={status === "playing" ? pause : play}
          style={[styles.playBtn, { backgroundColor: accentColor }]}
          activeOpacity={0.8}
        >
          {status === "playing" ? (
            <Pause color="#fff" size={22} fill="#fff" />
          ) : (
            <Play color="#fff" size={22} fill="#fff" style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Speed settings modal */}
      <Modal
        visible={settingsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSettingsOpen(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? "#1A1630" : "#F5EBD8" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#F0E6D3" : "#3D2B1F" },
              ]}
            >
              سرعة القراءة
            </Text>
            <View style={styles.speedGrid}>
              {SPEED_OPTIONS.map((rate) => {
                const selected = settings?.rate === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    onPress={async () => {
                      await updateSettings({ rate });
                      setSettingsOpen(false);
                      // Restart with new speed if currently playing
                      if (status === "playing") {
                        await stop();
                        setTimeout(play, 200);
                      }
                    }}
                    style={[
                      styles.speedOption,
                      {
                        backgroundColor: selected
                          ? accentColor
                          : isDark ? "#0F0D1A" : "#E8DDC9",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.speedOptionText,
                        {
                          color: selected
                            ? "#fff"
                            : isDark ? "#D4C8B5" : "#5C3D2E",
                          fontWeight: selected ? "800" : "600",
                        },
                      ]}
                    >
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Stop narration */}
            <TouchableOpacity
              onPress={async () => {
                await stop();
                setSettingsOpen(false);
              }}
              style={[
                styles.stopBtn,
                { borderColor: isDark ? "#3D3055" : "#C8B89A" },
              ]}
            >
              <Square color={isDark ? "#9E91B0" : "#8A6F5A"} size={14} />
              <Text
                style={[
                  styles.stopText,
                  { color: isDark ? "#9E91B0" : "#8A6F5A" },
                ]}
              >
                إيقاف القراءة
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  warningRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
    lineHeight: 16,
  },
  progressTrack: {
    height: 3,
    width: "100%",
  },
  progressFill: {
    height: 3,
  },
  controlsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  speedBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  speedText: {
    fontSize: 12,
    fontWeight: "800",
  },
  progressInfo: {
    flex: 1,
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Amiri_700Bold",
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 16,
  },
  speedGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  speedOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  speedOptionText: {
    fontSize: 15,
    fontFamily: "Amiri_700Bold",
  },
  stopBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  stopText: {
    fontSize: 13,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
});

export default AudioPlayer;
