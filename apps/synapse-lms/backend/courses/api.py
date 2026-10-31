from django.db.models import Q
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CoursePage, LessonPage
from gamification.models import LearnerProfile


class LessonSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonPage
        fields = ["id", "title", "slug", "order", "xp_value", "lesson_type", "estimated_minutes", "summary"]


class LessonDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonPage
        fields = [
            "id", "title", "slug", "order", "xp_value", "lesson_type", "estimated_minutes",
            "summary", "code_starter", "code_solution", "code_language", "code_task"
        ]


class CourseSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()
    lessons_count = serializers.SerializerMethodField()
    organization_name = serializers.ReadOnlyField(source="organization.name")
    organization_slug = serializers.ReadOnlyField(source="organization.slug")
    badge_title = serializers.ReadOnlyField(source="badge_reward.title")

    class Meta:
        model = CoursePage
        fields = [
            "id", "title", "slug", "subtitle", "track", "difficulty",
            "estimated_duration", "xp_reward", "neon_color", "icon_name",
            "organization_name", "organization_slug", "badge_title",
            "lessons_count", "lessons"
        ]

    def get_lessons(self, obj):
        lessons = obj.get_lessons()
        return LessonSummarySerializer(lessons, many=True).data

    def get_lessons_count(self, obj):
        return obj.get_lessons().count()


@api_view(["GET"])
def list_courses(request):
    track = request.GET.get("track")
    difficulty = request.GET.get("difficulty")
    search = request.GET.get("search")
    org_slug = request.GET.get("org")

    courses = CoursePage.objects.live()
    if track and track != "all":
        courses = courses.filter(track=track)
    if difficulty and difficulty != "all":
        courses = courses.filter(difficulty=difficulty.upper())
    if search:
        search_term = search.strip()
        courses = courses.filter(
            Q(title__icontains=search_term) |
            Q(subtitle__icontains=search_term) |
            Q(track__icontains=search_term)
        )
    if org_slug:
        courses = courses.filter(organization__slug=org_slug)

    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_course_detail(request, slug):
    try:
        course = CoursePage.objects.live().get(slug=slug)
    except CoursePage.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CourseSerializer(course)
    return Response(serializer.data)


@api_view(["GET"])
def get_lesson_detail(request, pk):
    try:
        lesson = LessonPage.objects.live().get(pk=pk)
    except LessonPage.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = LessonDetailSerializer(lesson)
    return Response(serializer.data)


@api_view(["POST"])
def complete_lesson(request, pk):
    callsign = request.data.get("callsign", "Cyber-Adept-01")
    try:
        lesson = LessonPage.objects.live().get(pk=pk)
    except LessonPage.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    profile, _ = LearnerProfile.objects.get_or_create(callsign=callsign)
    if pk not in profile.completed_lessons:
        profile.completed_lessons.append(pk)
        profile.current_xp += lesson.xp_value
        profile.save()

    return Response({
        "success": True,
        "lesson_id": pk,
        "xp_awarded": lesson.xp_value,
        "total_xp": profile.current_xp,
        "level": profile.level
    })

