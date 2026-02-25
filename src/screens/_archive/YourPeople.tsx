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
  PersonCard,
  colors,
  spacing,
  radius,
} from "../../../orbit-ds";
import { people, quietStats, TODAY, type Person } from "../../data/prototype";

const sections = [
  { id: "inner", label: "Inner Circle", data: people.innerCircle },
  { id: "kids", label: "Kids & School", data: people.kidsSchool },
  { id: "pro", label: "Advisors", data: people.professional },
  { id: "home", label: "Home Projects", data: people.contractors },
];

export default function YourPeople() {
  const [activeSection, setActiveSection] = useState("inner");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const currentSection = sections.find((s) => s.id === activeSection)!;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <OrbitText variant="legal" color="#b5ae9f" style={{ letterSpacing: 2.5, fontWeight: "500", marginBottom: 6 }}>
          {TODAY.toUpperCase()}
        </OrbitText>
        <OrbitText variant="title3" color={colors.foreground.primary} style={{ letterSpacing: -0.5 }}>
          Your People
        </OrbitText>
        <OrbitText variant="label4" color={colors.foreground.tertiary} style={{ marginTop: 4 }}>
          6 conversations need you · 4 threads waiting on others
        </OrbitText>
      </View>

      {/* Section tabs */}
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {sections.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => {
                  setActiveSection(s.id);
                  setSelectedPerson(null);
                }}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* People list */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {currentSection.data.map((person, idx) => {
          const key = `${activeSection}-${idx}`;
          return (
            <PersonCard
              key={key}
              name={person.name}
              relation={person.relation}
              avatar={person.avatar}
              color={person.color}
              status={person.status as "online" | "offline" | undefined}
              latestSubject={person.latestSubject}
              latestPreview={person.latestPreview}
              time={person.time}
              unread={person.unread}
              threads={person.threads}
              flag={person.flag}
              isExpanded={selectedPerson === key}
              onPress={() => setSelectedPerson(selectedPerson === key ? null : key)}
            />
          );
        })}

        {/* Other mail teaser */}
        <TouchableOpacity style={styles.otherMail} activeOpacity={0.7}>
          <View>
            <OrbitText variant="xSmall" color="#666" style={{ fontWeight: "500" }}>
              Other mail
            </OrbitText>
            <OrbitText variant="caption2" color="#aaa" style={{ marginTop: 2 }}>
              {quietStats.newsletters} newsletters ·{" "}
              {quietStats.promotional.toLocaleString()} promos ·{" "}
              {quietStats.socialNotifications} notifications — all organized
            </OrbitText>
          </View>
          <Text style={{ color: "#ccc", fontSize: 16 }}>{"\u2192"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F1",
  },
  header: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  tabBar: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  tabBarContent: {
    paddingHorizontal: spacing[6],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.foreground.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#999",
  },
  tabTextActive: {
    fontWeight: "600",
    color: colors.foreground.primary,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
  },
  otherMail: {
    marginTop: spacing[4],
    padding: 18,
    backgroundColor: colors.background.warmTertiary,
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
