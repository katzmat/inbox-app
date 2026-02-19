import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  OrbitText,
  Button,
  Card,
  SectionHeader,
  colors,
  spacing,
  radius,
  shadows,
} from "../../orbit-ds";
import {
  urgentItems,
  needsAttention,
  fyi,
  quietStats,
  USER_NAME,
  TODAY,
} from "../data/prototype";

function UrgentCard({
  item,
  expanded,
  onToggle,
  onDismiss,
}: {
  item: (typeof urgentItems)[0];
  expanded: boolean;
  onToggle: () => void;
  onDismiss: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.urgentCard, expanded && styles.urgentCardExpanded]}
    >
      <View style={styles.urgentRow}>
        <Text style={styles.urgentIcon}>{item.icon}</Text>
        <View style={styles.urgentContent}>
          <OrbitText variant="label2" color={colors.foreground.primary}>
            {item.subject}
          </OrbitText>
          <OrbitText variant="caption2" color={colors.foreground.tertiary} style={{ marginTop: 3 }}>
            {item.from} · {item.time}
          </OrbitText>
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronExpanded]}>{"\u25be"}</Text>
      </View>
      {expanded && (
        <View style={styles.urgentDetail}>
          <OrbitText variant="label4" color={colors.foreground.secondary} style={{ lineHeight: 22 }}>
            {item.detail}
          </OrbitText>
          <View style={styles.urgentActions}>
            <Button label="Open thread →" variant="neutral" size="sm" />
            <Button label="Dismiss" variant="tertiary" size="sm" onPress={onDismiss} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function RadarCard({
  item,
  expanded,
  onToggle,
}: {
  item: (typeof needsAttention)[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={styles.radarCard}
    >
      <View style={styles.radarRow}>
        <Text style={styles.radarIcon}>{item.icon}</Text>
        <View style={{ flex: 1 }}>
          <OrbitText variant="label4" color={colors.foreground.primary}>
            {item.subject}
          </OrbitText>
          {expanded && (
            <OrbitText variant="xSmall" color={colors.foreground.tertiary} style={{ marginTop: 6, lineHeight: 20 }}>
              {item.detail}
            </OrbitText>
          )}
        </View>
        <OrbitText variant="caption2" color="#aaa" style={{ marginLeft: spacing[3] }}>
          {item.time}
        </OrbitText>
      </View>
    </TouchableOpacity>
  );
}

export default function QuietReport() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [showHandled, setShowHandled] = useState(false);

  const visibleUrgent = urgentItems.filter((i) => !dismissed.has(i.id));
  const visibleRadar = needsAttention.filter((i) => !dismissed.has(i.id));
  const totalVisible = visibleUrgent.length + visibleRadar.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Masthead */}
      <View style={styles.masthead}>
        <OrbitText variant="legal" color="rgba(255,255,255,0.4)" style={{ letterSpacing: 3, fontWeight: "600", marginBottom: spacing[2] }}>
          YOUR QUIET REPORT
        </OrbitText>
        <OrbitText variant="title2" color={colors.foreground.onColor} style={{ fontWeight: "300" }}>
          Good morning, {USER_NAME}.
        </OrbitText>
        <OrbitText variant="body1" color="rgba(255,255,255,0.55)" style={{ fontWeight: "300", marginTop: 6 }}>
          {TODAY}
        </OrbitText>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statNumber}>{totalVisible}</Text>
            <OrbitText variant="caption2" color="rgba(255,255,255,0.4)" style={{ marginTop: spacing[1] }}>
              things need you
            </OrbitText>
          </View>
          <View style={styles.statDivider} />
          <View>
            <Text style={[styles.statNumber, styles.statNumberDim]}>
              {quietStats.autoHandled.toLocaleString()}
            </Text>
            <OrbitText variant="caption2" color="rgba(255,255,255,0.25)" style={{ marginTop: spacing[1] }}>
              handled quietly
            </OrbitText>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Urgent */}
        {visibleUrgent.length > 0 && (
          <Card elevation="default" style={styles.urgentSection}>
            <View style={styles.urgentHeader}>
              <View style={styles.urgentDot} />
              <OrbitText variant="legal" color={colors.status.urgent} style={{ letterSpacing: 2, fontWeight: "600" }}>
                NEEDS YOUR ATTENTION
              </OrbitText>
            </View>
            {visibleUrgent.map((item) => (
              <UrgentCard
                key={item.id}
                item={item}
                expanded={expanded === item.id}
                onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
                onDismiss={() => {
                  setDismissed(new Set([...dismissed, item.id]));
                  setExpanded(null);
                }}
              />
            ))}
          </Card>
        )}

        <SectionHeader label="On Your Radar" />
        {visibleRadar.map((item) => (
          <RadarCard
            key={item.id}
            item={item}
            expanded={expanded === item.id}
            onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
          />
        ))}

        <SectionHeader label="Coming Up" style={{ marginTop: spacing[6] }} />
        {fyi.map((item) => (
          <View key={item.id} style={styles.fyiRow}>
            <Text style={styles.fyiIcon}>{item.icon}</Text>
            <OrbitText variant="xSmall" color="#999" style={{ flex: 1, lineHeight: 20 }}>
              {item.subject}
            </OrbitText>
          </View>
        ))}

        {/* Handled quietly */}
        <TouchableOpacity
          onPress={() => setShowHandled(!showHandled)}
          style={styles.handledBar}
          activeOpacity={0.7}
        >
          <View>
            <OrbitText variant="xSmall" color={colors.foreground.tertiary} style={{ fontWeight: "500" }}>
              Everything else — organized quietly
            </OrbitText>
            <OrbitText variant="caption2" color="#b5ae9f" style={{ marginTop: 4 }}>
              {quietStats.promotional.toLocaleString()} promotional ·{" "}
              {quietStats.newsletters} newsletters ·{" "}
              {quietStats.receiptsOrganized} receipts
            </OrbitText>
          </View>
          <Text style={styles.chevron}>{showHandled ? "\u25b4" : "\u25be"}</Text>
        </TouchableOpacity>

        {showHandled && (
          <View style={styles.handledGrid}>
            {[
              { label: "Subscriptions tracked", value: quietStats.subscriptionsTracked, icon: "\ud83d\udce7" },
              { label: "Receipts organized", value: quietStats.receiptsOrganized, icon: "\ud83e\uddfe" },
              { label: "Promos archived", value: quietStats.promotional.toLocaleString(), icon: "\ud83c\udff7\ufe0f" },
              { label: "Newsletters filed", value: quietStats.newsletters, icon: "\ud83d\udcf0" },
            ].map((s, i) => (
              <View key={i} style={styles.handledStat}>
                <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                <View>
                  <Text style={styles.handledStatValue}>{s.value}</Text>
                  <OrbitText variant="legal" color="#aaa">
                    {s.label}
                  </OrbitText>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  masthead: {
    backgroundColor: colors.foreground.primary,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
  },
  statsRow: {
    flexDirection: "row",
    marginTop: spacing[8],
    gap: spacing[8],
  },
  statNumber: {
    fontSize: 48,
    fontWeight: "200",
    color: colors.foreground.onColor,
    letterSpacing: -2,
    lineHeight: 48,
  },
  statNumberDim: {
    color: "rgba(255,255,255,0.3)",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  content: {
    paddingHorizontal: spacing[6],
    marginTop: -spacing[6],
  },
  urgentSection: {
    borderRadius: radius.lg,
  },
  urgentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  urgentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.urgent,
  },
  urgentCard: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  urgentCardExpanded: {
    backgroundColor: "#FDFCF9",
  },
  urgentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  urgentIcon: {
    fontSize: 20,
  },
  urgentContent: {
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: "#ccc",
  },
  chevronExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  urgentDetail: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.line.warm,
  },
  urgentActions: {
    flexDirection: "row",
    gap: spacing[2],
    marginTop: spacing[3],
  },
  radarCard: {
    paddingHorizontal: spacing[5],
    paddingVertical: 14,
    backgroundColor: colors.background.primary,
    borderRadius: radius.md,
    marginBottom: spacing[2],
    ...shadows.cardSubtle,
  },
  radarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  radarIcon: {
    fontSize: 18,
  },
  fyiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
  },
  fyiIcon: {
    fontSize: 14,
  },
  handledBar: {
    marginTop: spacing[8],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: colors.background.warmSecondary,
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  handledGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[4],
    padding: spacing[5],
    backgroundColor: colors.background.primary,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    marginTop: -2,
    ...shadows.cardSubtle,
  },
  handledStat: {
    width: "45%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: spacing[3],
    backgroundColor: colors.background.warm,
    borderRadius: radius.md,
  },
  handledStatValue: {
    fontSize: 20,
    fontWeight: "300",
    color: colors.foreground.primary,
  },
});
