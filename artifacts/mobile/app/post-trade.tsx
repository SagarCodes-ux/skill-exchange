import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkillBadge } from "@/components/SkillBadge";
import { useApp, SKILLS_CATEGORIES, Skill } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const SKILL_OPTIONS: Skill[] = [
  { id: "o1", name: "UX Design", category: "Design", level: "intermediate" },
  { id: "o2", name: "Graphic Design", category: "Design", level: "intermediate" },
  { id: "o3", name: "React Native", category: "Development", level: "intermediate" },
  { id: "o4", name: "Node.js", category: "Development", level: "intermediate" },
  { id: "o5", name: "Web Development", category: "Development", level: "beginner" },
  { id: "o6", name: "Growth Marketing", category: "Marketing", level: "intermediate" },
  { id: "o7", name: "Content Writing", category: "Writing", level: "intermediate" },
  { id: "o8", name: "Photography", category: "Photography", level: "intermediate" },
  { id: "o9", name: "Music Production", category: "Music", level: "intermediate" },
  { id: "o10", name: "Data Analysis", category: "Data", level: "beginner" },
  { id: "o11", name: "SEO", category: "Marketing", level: "intermediate" },
  { id: "o12", name: "Video Editing", category: "Video", level: "intermediate" },
];

export default function PostTradeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTrade } = useApp();

  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 34 : insets.bottom;

  const [offerSkill, setOfferSkill] = useState<Skill | null>(null);
  const [wantSkill, setWantSkill] = useState<Skill | null>(null);
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("10");
  const [deadline, setDeadline] = useState("60");
  const [step, setStep] = useState<"offer" | "want" | "details">("offer");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = offerSkill && wantSkill && description.trim().length > 20 && Number(hours) > 0 && Number(deadline) > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !offerSkill || !wantSkill) return;
    setSubmitting(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTrade({
      offerSkill,
      wantSkill,
      description: description.trim(),
      hoursRequired: Number(hours),
      futureDeadlineDays: Number(deadline),
    });
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        "Trade Posted!",
        "Your trade is now live. We'll notify you when someone is interested.",
        [{ text: "View Feed", onPress: () => router.replace("/(tabs)/") }]
      );
    }, 600);
  };

  const STEPS = [
    { id: "offer", label: "You Offer", icon: "gift" },
    { id: "want", label: "You Want", icon: "heart" },
    { id: "details", label: "Details", icon: "file-text" },
  ] as const;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.stepBar, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        {STEPS.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            style={styles.stepItem}
            onPress={() => setStep(s.id)}
          >
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor: step === s.id ? colors.primary : (
                    (s.id === "want" && offerSkill) || (s.id === "details" && offerSkill && wantSkill)
                      ? colors.successLight
                      : colors.muted
                  ),
                },
              ]}
            >
              <Feather
                name={s.icon as any}
                size={14}
                color={step === s.id ? "#fff" : colors.mutedForeground}
              />
            </View>
            <Text style={[styles.stepLabel, { color: step === s.id ? colors.primary : colors.mutedForeground }]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
      >
        {step === "offer" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>What skill will you offer?</Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              Choose the skill you'll provide immediately to your trade partner
            </Text>
            <View style={styles.skillGrid}>
              {SKILL_OPTIONS.map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillOption,
                    {
                      borderColor: offerSkill?.id === skill.id ? colors.primary : colors.border,
                      backgroundColor: offerSkill?.id === skill.id ? colors.secondary : colors.card,
                    },
                  ]}
                  onPress={() => setOfferSkill(skill)}
                >
                  <SkillBadge skill={skill} />
                  {offerSkill?.id === skill.id && (
                    <Feather name="check-circle" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: offerSkill ? colors.primary : colors.muted }]}
              onPress={() => offerSkill && setStep("want")}
              disabled={!offerSkill}
            >
              <Text style={[styles.nextBtnText, { color: offerSkill ? "#fff" : colors.mutedForeground }]}>
                Next: What You Want
              </Text>
              <Feather name="arrow-right" size={18} color={offerSkill ? "#fff" : colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        )}

        {step === "want" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>What skill do you want?</Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              Choose the skill your partner will provide in the future
            </Text>
            <View style={styles.skillGrid}>
              {SKILL_OPTIONS.filter((s) => s.id !== offerSkill?.id).map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillOption,
                    {
                      borderColor: wantSkill?.id === skill.id ? colors.primary : colors.border,
                      backgroundColor: wantSkill?.id === skill.id ? colors.secondary : colors.card,
                    },
                  ]}
                  onPress={() => setWantSkill(skill)}
                >
                  <SkillBadge skill={skill} />
                  {wantSkill?.id === skill.id && (
                    <Feather name="check-circle" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: wantSkill ? colors.primary : colors.muted }]}
              onPress={() => wantSkill && setStep("details")}
              disabled={!wantSkill}
            >
              <Text style={[styles.nextBtnText, { color: wantSkill ? "#fff" : colors.mutedForeground }]}>
                Next: Trade Details
              </Text>
              <Feather name="arrow-right" size={18} color={wantSkill ? "#fff" : colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        )}

        {step === "details" && (
          <View style={styles.section}>
            {offerSkill && wantSkill && (
              <View style={[styles.summaryRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <SkillBadge skill={offerSkill} />
                <View style={[styles.arrowWrap, { backgroundColor: colors.primary }]}>
                  <Feather name="repeat" size={14} color="#fff" />
                </View>
                <SkillBadge skill={wantSkill} />
              </View>
            )}

            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Describe the trade</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Explain what you'll deliver, your experience level, what you're looking for in return, and any project requirements..."
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
              {description.length}/500 · Minimum 20 characters
            </Text>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Hours needed</Text>
                <View style={[styles.numInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.numInputText, { color: colors.foreground }]}
                    value={hours}
                    onChangeText={setHours}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Text style={[styles.numUnit, { color: colors.mutedForeground }]}>hrs</Text>
                </View>
              </View>
              <View style={styles.half}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Fulfill within</Text>
                <View style={[styles.numInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.numInputText, { color: colors.foreground }]}
                    value={deadline}
                    onChangeText={setDeadline}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Text style={[styles.numUnit, { color: colors.mutedForeground }]}>days</Text>
                </View>
              </View>
            </View>

            <View style={[styles.contractNote, { backgroundColor: colors.successLight, borderColor: "#D1FAE5" }]}>
              <Feather name="shield" size={18} color="#10B981" />
              <Text style={[styles.contractNoteText, { color: "#065F46" }]}>
                A smart contract will be automatically deployed on-chain when both parties accept the trade, securing the commitment.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: canSubmit && !submitting ? colors.primary : colors.muted }]}
              onPress={handleSubmit}
              disabled={!canSubmit || submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <Text style={[styles.submitBtnText, { color: canSubmit ? "#fff" : colors.mutedForeground }]}>
                  Publishing...
                </Text>
              ) : (
                <>
                  <Feather name="send" size={18} color={canSubmit ? "#fff" : colors.mutedForeground} />
                  <Text style={[styles.submitBtnText, { color: canSubmit ? "#fff" : colors.mutedForeground }]}>
                    Publish Trade
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stepBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  stepItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  scroll: {
    padding: 20,
    gap: 0,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  sectionSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginTop: -8,
  },
  skillGrid: {
    gap: 10,
  },
  skillOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  nextBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: -8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
    gap: 8,
  },
  numInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  numInputText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  numUnit: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  contractNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  contractNoteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  submitBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
