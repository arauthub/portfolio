from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail import blocks
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from tenancy.models import Organization
from gamification.models import Badge


class CodePlaygroundBlock(blocks.StructBlock):
    language = blocks.ChoiceBlock(
        choices=[("python", "Python 3"), ("typescript", "TypeScript"), ("rust", "Rust"), ("bash", "Cyber Shell")],
        default="python"
    )
    starter_code = blocks.TextBlock(default="# Initialize quantum state\nimport numpy as np\n")
    instructions = blocks.TextBlock(default="Write the algorithm to compute the superposition matrix.")
    expected_output = blocks.CharBlock(required=False, default="[1.0, 0.0]")

    class Meta:
        icon = "code"
        label = "Interactive Code Playground"


class HolographicSimBlock(blocks.StructBlock):
    simulation_type = blocks.ChoiceBlock(
        choices=[
            ("particle_accelerator", "Subatomic Particle Accelerator"),
            ("neural_synapse_3d", "3D Neural Synapse Visualizer"),
            ("orbital_mechanics", "Orbital Gravity Well Simulator"),
            ("cyber_mesh_grid", "Zero-Trust Cyber Defense Grid"),
        ],
        default="neural_synapse_3d"
    )
    title = blocks.CharBlock(default="Simulated Quantum Node Array")
    objective = blocks.TextBlock(default="Observe phase coherence in sub-zero quantum registers.")
    parameters_json = blocks.TextBlock(default='{"coherence_time_us": 120, "qubits": 64, "error_rate": 0.001}')

    class Meta:
        icon = "view"
        label = "Holographic 3D Simulation"


class CyberQuizBlock(blocks.StructBlock):
    question = blocks.CharBlock(default="What ensures cryptographic forward secrecy in quantum mesh?")
    options = blocks.ListBlock(blocks.CharBlock())
    correct_option_index = blocks.IntegerBlock(default=0)
    explanation = blocks.TextBlock(default="Lattice-based post-quantum cryptography prevents Shor algorithm attacks.")

    class Meta:
        icon = "tick-inverse"
        label = "In-Lesson Quick Check"


class CourseIndexPage(Page):
    intro = RichTextField(blank=True, default="<p>Explore high-dimensional learning tracks designed for futuristic mastery.</p>")

    subpage_types = ["courses.CoursePage"]

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
    ]

    api_fields = [
        APIField("intro"),
    ]

    def __str__(self):
        return self.title


class CoursePage(Page):
    TRACK_CHOICES = [
        ("quantum", "Quantum Computing & Algorithms"),
        ("cybersec", "Cybernetic Defense & Mesh Protocols"),
        ("ai", "Neural Networks & Artificial General Intelligence"),
        ("space", "Aero-Space & Gravitational Propulsion"),
    ]

    DIFFICULTY_CHOICES = [
        ("BEGINNER", "Level 1: Cadet"),
        ("INTERMEDIATE", "Level 2: Specialist"),
        ("ADVANCED", "Level 3: Architect"),
        ("SINGULARITY", "Level 4: Singularity Master"),
    ]

    subtitle = models.CharField(max_length=255, default="Master Next-Gen Engineering and Protocols")
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name="courses")
    track = models.CharField(max_length=50, choices=TRACK_CHOICES, default="ai")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default="INTERMEDIATE")
    estimated_duration = models.CharField(max_length=50, default="12 Hours")
    xp_reward = models.PositiveIntegerField(default=1200)
    neon_color = models.CharField(max_length=20, default="#00f3ff")
    badge_reward = models.ForeignKey(Badge, on_delete=models.SET_NULL, null=True, blank=True, related_name="reward_for_courses")
    icon_name = models.CharField(max_length=60, default="atom")

    subpage_types = ["courses.LessonPage"]
    parent_page_types = ["courses.CourseIndexPage"]

    content_panels = Page.content_panels + [
        FieldPanel("subtitle"),
        FieldPanel("organization"),
        FieldPanel("track"),
        FieldPanel("difficulty"),
        FieldPanel("estimated_duration"),
        FieldPanel("xp_reward"),
        FieldPanel("neon_color"),
        FieldPanel("badge_reward"),
        FieldPanel("icon_name"),
    ]

    api_fields = [
        APIField("subtitle"),
        APIField("track"),
        APIField("difficulty"),
        APIField("estimated_duration"),
        APIField("xp_reward"),
        APIField("neon_color"),
        APIField("icon_name"),
    ]

    def get_lessons(self):
        return LessonPage.objects.child_of(self).live().order_by("order")

    def __str__(self):
        return f"{self.title} ({self.track})"


class LessonPage(Page):
    LESSON_TYPES = [
        ("CONCEPT", "Neural Deep Dive (Concept)"),
        ("CODE_LAB", "Cyber Lab (Hands-on Code)"),
        ("HOLOGRAPHIC_SIM", "Hologram Simulator"),
        ("ASSESSMENT", "Cyber Assessment"),
    ]

    order = models.PositiveIntegerField(default=1)
    xp_value = models.PositiveIntegerField(default=150)
    lesson_type = models.CharField(max_length=30, choices=LESSON_TYPES, default="CONCEPT")
    estimated_minutes = models.PositiveIntegerField(default=15)
    summary = models.TextField(blank=True, default="")

    # Hands-on interactive code playground
    code_starter = models.TextField(blank=True, default="")
    code_solution = models.TextField(blank=True, default="")
    code_language = models.CharField(max_length=30, default="python")
    code_task = models.TextField(blank=True, default="")

    body = StreamField([
        ("rich_text", blocks.RichTextBlock()),
        ("code_playground", CodePlaygroundBlock()),
        ("holographic_sim", HolographicSimBlock()),
        ("quick_quiz", CyberQuizBlock()),
    ], use_json_field=True, blank=True)

    parent_page_types = ["courses.CoursePage"]
    subpage_types = []

    content_panels = Page.content_panels + [
        FieldPanel("order"),
        FieldPanel("xp_value"),
        FieldPanel("lesson_type"),
        FieldPanel("estimated_minutes"),
        FieldPanel("summary"),
        MultiFieldPanel([
            FieldPanel("code_starter"),
            FieldPanel("code_solution"),
            FieldPanel("code_language"),
            FieldPanel("code_task"),
        ], heading="Interactive Sandbox Configuration"),
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("order"),
        APIField("xp_value"),
        APIField("lesson_type"),
        APIField("estimated_minutes"),
        APIField("summary"),
        APIField("code_starter"),
        APIField("code_language"),
        APIField("code_task"),
    ]

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.order}. {self.title}"
