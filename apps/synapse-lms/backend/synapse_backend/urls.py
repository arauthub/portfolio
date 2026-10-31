from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

from search import views as search_views
from .api import wagtail_api_router

from tenancy.api import OrganizationViewSet
from courses import api as courses_api
from gamification import api as gamification_api
from assessments import api as assessments_api

# DRF Router for viewsets
router = DefaultRouter()
router.register(r"organizations", OrganizationViewSet, basename="organization")

api_patterns = [
    # Router endpoints (Organizations, Tenancy)
    path("", include(router.urls)),

    # Courses API
    path("courses/", courses_api.list_courses, name="api-courses-list"),
    path("courses/<slug:slug>/", courses_api.get_course_detail, name="api-course-detail"),
    path("lessons/<int:pk>/", courses_api.get_lesson_detail, name="api-lesson-detail"),
    path("lessons/<int:pk>/complete/", courses_api.complete_lesson, name="api-lesson-complete"),

    # Gamification API
    path("gamification/profile/", gamification_api.get_learner_profile, name="api-gamification-profile"),
    path("gamification/award-xp/", gamification_api.award_xp, name="api-gamification-award-xp"),
    path("gamification/skill-tree/", gamification_api.get_skill_tree, name="api-gamification-skill-tree"),
    path("gamification/unlock-skill/", gamification_api.unlock_skill, name="api-gamification-unlock-skill"),
    path("gamification/quests/", gamification_api.get_quests, name="api-gamification-quests"),
    path("gamification/badges/", gamification_api.get_badges, name="api-gamification-badges"),
    path("gamification/leaderboard/", gamification_api.get_leaderboard, name="api-gamification-leaderboard"),

    # Assessments API
    path("assessments/quiz/<int:pk>/", assessments_api.get_quiz, name="api-assessment-quiz"),
    path("assessments/quiz/<int:pk>/submit/", assessments_api.submit_quiz, name="api-assessment-quiz-submit"),
]

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("admin/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("search/", search_views.search, name="search"),

    # Wagtail API v2 (Headless Pages/Images/Documents)
    path("api/v2/", wagtail_api_router.urls),

    # Synapse LMS REST API v1
    path("api/v1/", include(api_patterns)),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = urlpatterns + [
    # Wagtail's page serving mechanism
    path("", include(wagtail_urls)),
]
