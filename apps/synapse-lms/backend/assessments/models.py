from django.db import models
from wagtail.snippets.models import register_snippet


@register_snippet
class CyberQuiz(models.Model):
    title = models.CharField(max_length=200)
    course_slug = models.SlugField(max_length=100, blank=True, default="")
    lesson_order = models.PositiveIntegerField(default=1)
    passing_score = models.PositiveIntegerField(default=75, help_text="Passing percentage")
    time_limit_seconds = models.PositiveIntegerField(default=180, help_text="Time limit in seconds")
    xp_bounty = models.PositiveIntegerField(default=300)
    questions = models.JSONField(
        default=list,
        help_text="List of questions with prompt, options, correct_index, explanation, code_sample"
    )

    def __str__(self):
        return f"{self.title} (+{self.xp_bounty} XP)"

    class Meta:
        verbose_name_plural = "Cyber Quizzes"


class QuizAttempt(models.Model):
    quiz = models.ForeignKey(CyberQuiz, on_delete=models.CASCADE, related_name="attempts")
    learner_callsign = models.CharField(max_length=100, default="Learner-01")
    score_percent = models.PositiveIntegerField()
    passed = models.BooleanField(default=False)
    xp_awarded = models.PositiveIntegerField(default=0)
    answers_submitted = models.JSONField(default=dict)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "PASSED" if self.passed else "FAILED"
        return f"{self.learner_callsign} - {self.quiz.title}: {self.score_percent}% ({status})"

    class Meta:
        ordering = ["-submitted_at"]
