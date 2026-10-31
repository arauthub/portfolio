from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.filter(is_active=True)
    serializer_class = OrganizationSerializer
    lookup_field = "slug"

    @action(detail=True, methods=["post"])
    def update_branding(self, request, slug=None):
        org = self.get_object()
        for field in ["primary_color", "secondary_color", "accent_color", "theme_preset", "font_preset", "slogan"]:
            if field in request.data:
                setattr(org, field, request.data[field])
        org.save()
        return Response(OrganizationSerializer(org).data)

    @action(detail=True, methods=["get"])
    def export_config(self, request, slug=None):
        org = self.get_object()
        config = {
            "version": "2.0-cyber",
            "organization": {
                "name": org.name,
                "slug": org.slug,
                "subdomain": org.subdomain,
                "slogan": org.slogan,
                "theme": {
                    "primary_color": org.primary_color,
                    "secondary_color": org.secondary_color,
                    "accent_color": org.accent_color,
                    "preset": org.theme_preset,
                    "font": org.font_preset,
                },
                "features": {
                    "gamification": org.enable_gamification,
                    "quests": org.enable_quests,
                    "skill_tree": org.enable_skill_tree,
                    "sound_fx": org.enable_sound_fx,
                    "certificates": org.enable_certificates,
                },
                "deployment": {
                    "wagtail_version": "5.2.8 LTS",
                    "frontend": "Angular 22",
                    "docker_image": f"synapse-lms/tenant:{org.slug}",
                }
            }
        }
        return Response(config)

