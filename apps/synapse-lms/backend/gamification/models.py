from django.db import models
from django.contrib.auth.models import User
from tenancy.models import Organization
from wagtail.snippets.models import register_snippet


@register_snippet
class Badge(models.Model):
    RARITY_CHOICES = [
        ("COMMON", "Common (Silver Glow)"),
        ("RARE", "Rare (Cyan Neon)"),
        ("EPIC", "Epic (Purple Hologram)"),
        ("LEGENDARY", "Legendary (Golden Flare)"),
    ]

    code = models.SlugField(max_length=50, unique=True)
    title = models.CharField(max_length=150)
    description = models.TextField()
    icon_name = models.CharField(max_length=60, default="zap", help_text="Lucide/SVG icon identifier")
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default="RARE")
    xp_bonus = models.PositiveIntegerField(default=250)
    hologram_visual = models.CharField(max_length=50, default="hex-shield")

    def __str__(self):
        return f"{self.title} [{self.rarity}]"


@register_snippet
class SkillNode(models.Model):
    TRACK_CHOICES = [
        ("quantum", "Quantum Computing & Algorithms"),
        ("cybersec", "Cybernetic Defense & Mesh Protocols"),
        ("ai", "Neural Networks & Artificial General Intelligence"),
        ("space", "Aero-Space & Gravitational Propulsion"),
    ]

    slug = models.SlugField(max_length=80, unique=True)
    title = models.CharField(max_length=150)
    track = models.CharField(max_length=50, choices=TRACK_CHOICES)
    tier = models.PositiveSmallIntegerField(default=1, help_text="1 to 4 tier level")
    parent_slug = models.SlugField(max_length=80, blank=True, null=True, help_text="Parent skill slug in tree")
    description = models.TextField()
    xp_cost = models.PositiveIntegerField(default=300)
    icon = models.CharField(max_length=60, default="cpu")
    is_unlocked_default = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.title} (Tier {self.tier} - {self.track})"

    class Meta:
        ordering = ["track", "tier", "order"]


@register_snippet
class Quest(models.Model):
    QUEST_TYPE_CHOICES = [
        ("DAILY", "Daily Hack (Resets Every 24H)"),
        ("WEEKLY", "Weekly Protocol (Major Bounty)"),
        ("SPECIAL", "Special Operation (Milestone)"),
    ]

    code = models.SlugField(max_length=60, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    quest_type = models.CharField(max_length=20, choices=QUEST_TYPE_CHOICES, default="DAILY")
    target_metric = models.CharField(max_length=60, default="lessons_completed", help_text="e.g. lessons_completed, quiz_perfect, xp_milestone")
    target_count = models.PositiveIntegerField(default=1)
    xp_reward = models.PositiveIntegerField(default=200)
    icon = models.CharField(max_length=60, default="target")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"[{self.quest_type}] {self.title} (+{self.xp_reward} XP)"


class LearnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="learner_profile", null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="learners", null=True, blank=True)
    callsign = models.CharField(max_length=100, default="Nova-01")
    avatar_url = models.CharField(max_length=255, default="cyber-avatar-1")
    role = models.CharField(max_length=20, default="LEARNER")  # LEARNER, INSTRUCTOR, ADMIN
    current_xp = models.PositiveIntegerField(default=750)
    level = models.PositiveIntegerField(default=2)
    streak_days = models.PositiveIntegerField(default=4)
    badges = models.ManyToManyField(Badge, blank=True, related_name="earned_by")
    unlocked_skills = models.JSONField(default=list, blank=True)
    completed_lessons = models.JSONField(default=list, blank=True)
    active_quests_progress = models.JSONField(default=dict, blank=True)

    def calculate_level(self):
        # 500 XP per level
        return max(1, (self.current_xp // 500) + 1)

    def save(self, *args, **kwargs):
        self.level = self.calculate_level()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.callsign} (Lvl {self.level} - {self.current_xp} XP)"
