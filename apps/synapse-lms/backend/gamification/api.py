from rest_framework import serializers, viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Badge, SkillNode, Quest, LearnerProfile
from tenancy.models import Organization


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = "__all__"


class SkillNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillNode
        fields = "__all__"


class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = "__all__"


class LearnerProfileSerializer(serializers.ModelSerializer):
    badges = BadgeSerializer(many=True, read_only=True)
    organization_name = serializers.ReadOnlyField(source="organization.name")
    organization_slug = serializers.ReadOnlyField(source="organization.slug")
    next_level_xp = serializers.SerializerMethodField()
    progress_to_next_level = serializers.SerializerMethodField()

    class Meta:
        model = LearnerProfile
        fields = [
            "id", "callsign", "avatar_url", "role", "current_xp", "level",
            "streak_days", "badges", "unlocked_skills", "completed_lessons",
            "active_quests_progress", "organization_name", "organization_slug",
            "next_level_xp", "progress_to_next_level"
        ]

    def get_next_level_xp(self, obj):
        return obj.level * 500

    def get_progress_to_next_level(self, obj):
        base_xp = (obj.level - 1) * 500
        current_in_level = obj.current_xp - base_xp
        return min(100, max(0, int((current_in_level / 500) * 100)))


def get_or_create_default_profile(callsign="Cyber-Adept-01"):
    profile, created = LearnerProfile.objects.get_or_create(
        callsign=callsign,
        defaults={
            "current_xp": 1250,
            "level": 3,
            "streak_days": 5,
            "unlocked_skills": ["quantum-basics", "qubit-gates", "zero-trust-foundations"],
            "completed_lessons": [1, 2],
            "active_quests_progress": {"daily-lesson": 1, "perfect-quiz": 0},
        }
    )
    if created and not profile.organization:
        org = Organization.objects.first()
        if org:
            profile.organization = org
            profile.save()
    return profile


@api_view(["GET"])
def get_learner_profile(request):
    callsign = request.GET.get("callsign", "Cyber-Adept-01")
    profile = get_or_create_default_profile(callsign)
    return Response(LearnerProfileSerializer(profile).data)


@api_view(["POST"])
def award_xp(request):
    callsign = request.data.get("callsign", "Cyber-Adept-01")
    xp_amount = int(request.data.get("xp", 100))
    lesson_id = request.data.get("lesson_id")
    quest_code = request.data.get("quest_code")

    profile = get_or_create_default_profile(callsign)
    old_level = profile.level
    profile.current_xp += xp_amount

    if lesson_id and lesson_id not in profile.completed_lessons:
        profile.completed_lessons.append(lesson_id)

    profile.save()

    leveled_up = profile.level > old_level
    return Response({
        "success": True,
        "xp_awarded": xp_amount,
        "current_xp": profile.current_xp,
        "level": profile.level,
        "leveled_up": leveled_up,
        "new_level_title": f"Level {profile.level} Elite Architect"
    })


@api_view(["GET"])
def get_skill_tree(request):
    nodes = SkillNode.objects.all().order_by("track", "tier", "order")
    serializer = SkillNodeSerializer(nodes, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def unlock_skill(request):
    callsign = request.data.get("callsign", "Cyber-Adept-01")
    skill_slug = request.data.get("skill_slug")

    profile = get_or_create_default_profile(callsign)
    try:
        node = SkillNode.objects.get(slug=skill_slug)
    except SkillNode.DoesNotExist:
        return Response({"error": "Skill node not found"}, status=status.HTTP_404_NOT_FOUND)

    if skill_slug in profile.unlocked_skills:
        return Response({"message": "Skill already unlocked", "unlocked_skills": profile.unlocked_skills})

    if profile.current_xp < node.xp_cost:
        return Response({
            "error": "Insufficient XP",
            "required_xp": node.xp_cost,
            "current_xp": profile.current_xp
        }, status=status.HTTP_400_BAD_REQUEST)

    profile.unlocked_skills.append(skill_slug)
    profile.save()

    return Response({
        "success": True,
        "unlocked_skill": skill_slug,
        "title": node.title,
        "unlocked_skills": profile.unlocked_skills
    })


@api_view(["GET"])
def get_quests(request):
    quests = Quest.objects.filter(is_active=True)
    serializer = QuestSerializer(quests, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_badges(request):
    badges = Badge.objects.all()
    serializer = BadgeSerializer(badges, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_leaderboard(request):
    leaderboard = [
        {"rank": 1, "callsign": "Singularity-X", "level": 14, "xp": 7200, "badges": 12, "streak": 28, "status": "ONLINE"},
        {"rank": 2, "callsign": "Valkyrie-7", "level": 11, "xp": 5600, "badges": 9, "streak": 19, "status": "IN MISSION"},
        {"rank": 3, "callsign": "Cyber-Adept-01", "level": 3, "xp": 1250, "badges": 3, "streak": 5, "status": "ONLINE"},
        {"rank": 4, "callsign": "GlitchHunter", "level": 2, "xp": 950, "badges": 2, "streak": 3, "status": "OFFLINE"},
        {"rank": 5, "callsign": "QuantumPhantom", "level": 2, "xp": 800, "badges": 1, "streak": 2, "status": "ONLINE"},
    ]
    return Response(leaderboard)

