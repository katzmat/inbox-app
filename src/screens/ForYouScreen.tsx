import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../orbit-ds";

// --- Assets ---
const avatarUser = require("../../assets/figma/avatar-user.png");
const chipKidsSchool = require("../../assets/figma/chip-kids-school.png");
const chipTravel = require("../../assets/figma/chip-travel.png");
const chipHomeReno = require("../../assets/figma/chip-home-reno.png");
const chipOffers = require("../../assets/figma/chip-offers.png");
const avatarTina = require("../../assets/figma/avatar-tina.png");
const avatarEverlane = require("../../assets/figma/avatar-everlane.png");
const avatarBrackett = require("../../assets/figma/avatar-brackett.png");
const avatarInterview = require("../../assets/figma/avatar-interview.png");
const adTravel = require("../../assets/figma/ad-travel.png");
const avatarLonelyPlanet = require("../../assets/figma/avatar-lonely-planet.png");
const avatarBrightHorizons = require("../../assets/figma/avatar-bright-horizons.png");
const packageAfloral = require("../../assets/figma/package-afloral.png");
const packageWayfair = require("../../assets/figma/package-wayfair.png");
const packageAllbirds = require("../../assets/figma/package-allbirds.png");
const adTravel2 = require("../../assets/figma/ad-travel-2.png");

// --- Colors ---
const C = {
  bg: "#f6f6f6",
  white: "#fff",
  text: "#1d1d1d",
  textSecondary: "#626262",
  textTertiary: "#767676",
  border: "#eee",
  borderDark: "rgba(0,0,0,0.15)",
  borderImage: "rgba(0,0,0,0.03)",
  bgTertiary: "rgba(0,0,0,0.06)",
  brand: colors.brand, // #7d2eff
  brandActive: "#853cfd",
  trackBg: "#ddd",
};

// --- Life thread chip data ---
const LIFE_THREADS = [
  { label: "Kids school", count: 3, bg: "#d9efbc", textColor: C.text, image: chipKidsSchool },
  { label: "Travel", count: 2, bg: "#8d3880", textColor: C.white, image: chipTravel },
  { label: "Home renovation", count: 6, bg: "#4b7d9f", textColor: C.white, image: chipHomeReno },
  { label: "Offers", count: 2, bg: "#d2d2f6", textColor: C.text, image: chipOffers },
];

// --- Priority emails ---
const PRIORITY_EMAILS = [
  {
    name: "Tina Giella",
    count: 2,
    summary: "Asks for a response about the lease and shared a photo.",
    avatar: avatarTina,
    action: null,
  },
  {
    name: "Everlane",
    count: null,
    summary: "Support made an exception for your order and sent a return slip.",
    avatar: avatarEverlane,
    action: "View PDF",
  },
  {
    name: "Brackett Smith",
    count: null,
    summary: "Shared flight itinerary from DCA to JFK on Oct 17.",
    avatar: avatarBrackett,
    action: null,
  },
];

// --- Calendar events ---
const CALENDAR_EVENTS = [
  { day: "11", title: "TPES Athletics Registration begins", time: "Sun, all day", avatar: null, hasAdd: true },
  { day: "12", title: "Lunch Interview", time: "Mon, 2-3 PM", avatar: avatarInterview, hasAdd: false },
  { day: "15", title: "Summer", time: "Wed, 12-3 PM", avatar: avatarInterview, hasAdd: false },
];

// --- Priority senders ---
const PRIORITY_SENDERS = [
  { name: "Tina", avatar: avatarTina, count: 2, isPhoto: true },
  { name: "Brackett", avatar: avatarBrackett, count: 1, isPhoto: true },
  { name: "Bright Horizons", avatar: avatarBrightHorizons, count: null, isPhoto: true },
  { name: "Becca", avatar: null, count: null, isPhoto: false, initials: "BG", bgColor: "#a348b1" },
];

// --- Packages ---
const PACKAGES = [
  { sender: "Afloral", eta: "Today at 3pm", progress: 0.78, image: packageAfloral },
  { sender: "Wayfair", eta: "Friday", progress: 0.49, image: packageWayfair },
  { sender: "All Birds", eta: "Aug 30 - Sep 2", progress: 0.1, image: packageAllbirds },
];

export default function ForYouScreen() {
  const [priorityTab, setPriorityTab] = useState<"all" | "review">("review");

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>For you</Text>
          <View style={s.headerIcons}>
            <Ionicons name="pencil-outline" size={24} color={C.text} />
            <Ionicons name="search-outline" size={24} color={C.text} style={{ marginLeft: 16 }} />
            <Image source={avatarUser} style={s.headerAvatar} />
          </View>
        </View>

        {/* Follow up card */}
        <View style={s.card}>
          <View style={{ gap: 4, width: "100%" }}>
            <Text style={s.cardTitle}>Follow up?</Text>
            <Text style={s.cardBody} numberOfLines={2}>
              William Colgrove hasn't yet opened your message since it was sent 5 days ago.
            </Text>
          </View>
          <View style={s.cardButtons}>
            <TouchableOpacity style={s.btnPrimary} activeOpacity={0.8}>
              <Text style={s.btnPrimaryText}>Send nudge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnSecondary} activeOpacity={0.8}>
              <Text style={s.btnSecondaryText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Life thread chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipsRow}>
          {LIFE_THREADS.map((t) => (
            <View key={t.label} style={[s.chip, { backgroundColor: t.bg }]}>
              <Image source={t.image} style={s.chipImage} />
              <Text style={[s.chipLabel, { color: t.textColor }]}>{t.label}</Text>
              <Text style={[s.chipCount, { color: t.textColor, opacity: 0.6 }]}>{t.count}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Priority section */}
        <View style={s.priorityCard}>
          <View style={s.priorityInner}>
            {/* Priority header */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Priority</Text>
              <Text style={s.sectionMeta}>8 new</Text>
            </View>

            {/* Priority emails */}
            {PRIORITY_EMAILS.map((email, i) => (
              <View key={i} style={s.emailRow}>
                <View style={email.action ? { paddingTop: 6 } : undefined}>
                  <Image source={email.avatar} style={s.emailAvatar} />
                </View>
                <View style={{ flex: 1, gap: email.action ? 8 : 0 }}>
                  <Text style={s.emailText} numberOfLines={2}>
                    <Text style={s.emailName}>{email.name} </Text>
                    {email.count && <Text style={s.emailCount}>{email.count} </Text>}
                    <Text style={s.emailDot}> ·  </Text>
                    <Text style={s.emailSummary}>{email.summary}</Text>
                  </Text>
                  {email.action && (
                    <TouchableOpacity style={s.actionBtn} activeOpacity={0.7}>
                      <Text style={s.actionBtnText}>{email.action}</Text>
                      <Ionicons name="document-outline" size={16} color={C.text} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Priority footer tabs */}
          <View style={s.priorityFooter}>
            <TouchableOpacity
              style={[s.priorityTab, s.priorityTabLeft]}
              onPress={() => setPriorityTab("all")}
              activeOpacity={0.7}
            >
              <Text style={[s.priorityTabText, priorityTab === "all" && s.priorityTabActive]}>
                All mail
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.priorityTab}
              onPress={() => setPriorityTab("review")}
              activeOpacity={0.7}
            >
              <Text style={[s.priorityTabText, priorityTab === "review" && s.priorityTabActive]}>
                Review priority
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar events */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.calendarRow}>
          {CALENDAR_EVENTS.map((ev, i) => (
            <View key={i} style={s.calendarCard}>
              {ev.hasAdd && (
                <View style={s.calendarAddBtn}>
                  <Ionicons name="add" size={16} color={C.text} />
                </View>
              )}
              <View style={s.calendarInner}>
                <Text style={s.calendarDay}>{ev.day}</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={s.calendarTitle} numberOfLines={1}>{ev.title}</Text>
                  <View style={s.calendarTimeLine}>
                    <Text style={s.calendarTime}>{ev.time}</Text>
                    {ev.avatar && <Image source={ev.avatar} style={s.calendarAvatar} />}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Ad card 1 */}
        <AdCard image={adTravel} />

        {/* Priority senders */}
        <View style={{ paddingVertical: 8, gap: 16 }}>
          <Text style={s.sectionTitleSmall}>Priority senders</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.sendersRow}>
              {PRIORITY_SENDERS.map((sender, i) => (
                <View key={i} style={s.senderItem}>
                  <View style={{ position: "relative" }}>
                    {sender.isPhoto ? (
                      <Image source={sender.avatar} style={s.senderAvatar} />
                    ) : (
                      <View style={[s.senderAvatar, { backgroundColor: sender.bgColor, justifyContent: "center", alignItems: "center" }]}>
                        <Text style={s.senderInitials}>{sender.initials}</Text>
                      </View>
                    )}
                    {sender.count != null && (
                      <View style={s.senderBadge}>
                        <Text style={s.senderBadgeText}>{sender.count}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.senderName} numberOfLines={1}>{sender.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* On the way (packages) */}
        <View style={s.packagesCard}>
          <Text style={s.sectionTitleSmall}>On the way</Text>
          {PACKAGES.map((pkg, i) => (
            <View key={i} style={s.packageRow}>
              <View style={{ flex: 1, gap: 16 }}>
                <Text style={s.packageText}>
                  <Text style={s.emailName}>{pkg.sender}</Text>
                  {"\n"}
                  <Text style={s.emailSummary}>{pkg.eta}</Text>
                </Text>
                <View style={s.progressTrack}>
                  <View style={[s.progressFill, { width: `${pkg.progress * 100}%` }]} />
                </View>
              </View>
              <Image source={pkg.image} style={s.packageImage} />
            </View>
          ))}
        </View>

        {/* Ad card 2 */}
        <AdCard image={adTravel2} />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom nav */}
      <View style={s.nav}>
        <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
          <Ionicons name="home" size={24} color={C.brand} />
        </TouchableOpacity>
        <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={24} color={C.text} />
        </TouchableOpacity>
        <TouchableOpacity style={s.navItem} activeOpacity={0.7}>
          <Text style={s.navBang}>!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Ad card component ---
function AdCard({ image }: { image: any }) {
  return (
    <View style={s.adCard}>
      <Image source={image} style={s.adImage} resizeMode="cover" />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={s.emailRow}>
          <Image source={avatarLonelyPlanet} style={s.emailAvatar} />
          <Text style={s.emailText} numberOfLines={2}>
            <Text style={s.emailName}>Lonely Planet </Text>
            <Text style={s.emailDot}> Ad</Text>
            <Text style={s.emailName}> </Text>
            <Text style={s.emailDot}> ·  Love travel? Find secret lorem ipsum dolor.</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

// --- Styles ---
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60,
    gap: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 46,
    fontWeight: "500",
    color: C.text,
    letterSpacing: -0.92,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
  },

  // Follow-up card
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.44,
  },
  cardBody: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
    color: C.textSecondary,
  },
  cardButtons: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  btnPrimary: {
    flex: 1,
    height: 40,
    backgroundColor: C.brand,
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.white,
  },
  btnSecondary: {
    flex: 1,
    height: 40,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.borderDark,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.text,
  },

  // Life thread chips
  chipsRow: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
    paddingRight: 12,
    gap: 4,
  },
  chipImage: {
    width: 40,
    height: 40,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 18,
    marginLeft: 8,
  },
  chipCount: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 18,
  },

  // Priority section
  priorityCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    overflow: "hidden",
  },
  priorityInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.44,
  },
  sectionMeta: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
    color: C.textSecondary,
  },
  sectionTitleSmall: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.4,
  },

  // Email rows
  emailRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  emailAvatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
  },
  emailText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: C.text,
  },
  emailName: {
    fontWeight: "600",
  },
  emailCount: {
    fontWeight: "400",
    color: C.textSecondary,
  },
  emailDot: {
    color: C.textTertiary,
  },
  emailSummary: {
    fontWeight: "400",
    color: C.textSecondary,
  },

  // Action button (e.g. View PDF)
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    height: 32,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: C.borderDark,
    borderRadius: 20,
    backgroundColor: C.white,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: C.text,
  },

  // Priority footer tabs
  priorityFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.07)",
    marginTop: 16,
  },
  priorityTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  priorityTabLeft: {
    borderRightWidth: 1,
    borderRightColor: C.bgTertiary,
  },
  priorityTabText: {
    fontSize: 16,
    fontWeight: "500",
    color: C.textSecondary,
  },
  priorityTabActive: {
    fontWeight: "600",
    color: C.brandActive,
  },

  // Calendar
  calendarRow: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  calendarCard: {
    width: 248,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 22,
    marginRight: 8,
  },
  calendarAddBtn: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: C.bgTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarInner: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
  },
  calendarDay: {
    fontSize: 46,
    fontWeight: "500",
    color: C.text,
    lineHeight: 64,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: C.text,
  },
  calendarTimeLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarTime: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: C.textTertiary,
  },
  calendarAvatar: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },

  // Ad card
  adCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    overflow: "hidden",
    gap: 16,
    paddingBottom: 16,
  },
  adImage: {
    width: "100%",
    height: 200,
  },

  // Priority senders
  sendersRow: {
    flexDirection: "row",
    gap: 12,
  },
  senderItem: {
    alignItems: "center",
    gap: 10,
  },
  senderAvatar: {
    width: 96,
    height: 96,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: C.borderImage,
  },
  senderInitials: {
    fontSize: 48,
    fontWeight: "300",
    color: C.white,
    letterSpacing: -0.48,
    textAlign: "center",
  },
  senderBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: C.brandActive,
    alignItems: "center",
    justifyContent: "center",
  },
  senderBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.white,
    textAlign: "center",
  },
  senderName: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
    textAlign: "center",
    maxWidth: 96,
  },

  // Packages
  packagesCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  packageRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  packageText: {
    fontSize: 16,
    lineHeight: 22,
    color: C.text,
  },
  progressTrack: {
    height: 4,
    backgroundColor: C.trackBg,
    borderRadius: 2,
    width: "100%",
  },
  progressFill: {
    height: 4,
    backgroundColor: C.brandActive,
    borderRadius: 2,
  },
  packageImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: C.white,
  },

  // Bottom nav
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: "rgba(246,246,246,0.75)",
  },
  navItem: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  navBang: {
    fontSize: 36,
    fontWeight: "400",
    color: C.text,
    textAlign: "center",
    letterSpacing: -0.36,
    lineHeight: 36,
  },
});
