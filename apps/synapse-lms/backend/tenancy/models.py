from django.db import models
from wagtail.snippets.models import register_snippet


@register_snippet
class Organization(models.Model):
    THEME_PRESETS = [
        ("cyber_neon", "Cyber Neon (Cyan & Pink)"),
        ("quantum_void", "Quantum Void (Deep Purple & Indigo)"),
        ("matrix_emerald", "Matrix Emerald (Terminal Green & Cyan)"),
        ("solar_amber", "Solar Flare (Amber Gold & Crimson)"),
        ("solar_light", "Solar Light (Holographic Frost & Sky Blue)"),
        ("quantum_aurora", "Quantum Aurora (Teal & Violet Light)"),
    ]

    FONT_PRESETS = [
        ("orbitron", "Orbitron (Futuristic Display)"),
        ("space_grotesk", "Space Grotesk (Tech Modern)"),
        ("jetbrains", "JetBrains Mono (Developer Cyber)"),
    ]

    MODE_CHOICES = [
        ("dark", "Dark Cyber Void"),
        ("light", "Solar High-Tech Light"),
    ]

    name = models.CharField(max_length=200, help_text="Organization display name")
    slug = models.SlugField(max_length=100, unique=True, help_text="Unique URL identifier for the organization")
    subdomain = models.CharField(max_length=100, unique=True, help_text="Subdomain e.g. cyberdyne.synapse.io")
    slogan = models.CharField(max_length=255, default="Next-Generation Learning Protocols", blank=True)
    logo_url = models.URLField(blank=True, default="", help_text="SVG or PNG logo URL")
    contact_email = models.EmailField(blank=True, default="admin@synapse.org")

    # Futuristic Theme Customization
    primary_color = models.CharField(max_length=20, default="#00f3ff", help_text="Hex code for primary neon glow")
    secondary_color = models.CharField(max_length=20, default="#a855f7", help_text="Hex code for secondary glow")
    accent_color = models.CharField(max_length=20, default="#ff0055", help_text="Hex code for accent alerts/highlights")
    theme_preset = models.CharField(max_length=50, choices=THEME_PRESETS, default="cyber_neon")
    font_preset = models.CharField(max_length=50, choices=FONT_PRESETS, default="orbitron")
    default_mode = models.CharField(max_length=10, choices=MODE_CHOICES, default="dark", help_text="Default UI environment mode")

    # Feature Toggles
    enable_gamification = models.BooleanField(default=True)
    enable_quests = models.BooleanField(default=True)
    enable_skill_tree = models.BooleanField(default=True)
    enable_sound_fx = models.BooleanField(default=True)
    enable_certificates = models.BooleanField(default=True)

    # Seat & Deployment Info
    seat_capacity = models.PositiveIntegerField(default=500)
    active_learners = models.PositiveIntegerField(default=42)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.slug})"

    class Meta:
        ordering = ["name"]
