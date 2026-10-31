from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CyberQuiz, QuizAttempt
from gamification.models import LearnerProfile


class CyberQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = CyberQuiz
        fields = ["id", "title", "course_slug", "lesson_order", "passing_score", "time_limit_seconds", "xp_bounty", "questions"]


@api_view(["GET"])
def get_quiz(request, pk):
    try:
        quiz = CyberQuiz.objects.get(pk=pk)
    except CyberQuiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    data = CyberQuizSerializer(quiz).data
    # Clean answers if learner view
    sanitized_questions = []
    for q in data["questions"]:
        clean_q = {
            "id": q.get("id"),
            "prompt": q.get("prompt"),
            "options": q.get("options", []),
            "code_sample": q.get("code_sample", ""),
        }
        sanitized_questions.append(clean_q)

    data["questions"] = sanitized_questions
    return Response(data)


@api_view(["POST"])
def submit_quiz(request, pk):
    callsign = request.data.get("callsign", "Cyber-Adept-01")
    user_answers = request.data.get("answers", {})  # { question_id: selected_index }

    try:
        quiz = CyberQuiz.objects.get(pk=pk)
    except CyberQuiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    questions = quiz.questions
    total_questions = len(questions)
    if total_questions == 0:
        return Response({"error": "No questions in quiz"}, status=status.HTTP_400_BAD_REQUEST)

    correct_count = 0
    feedback = []

    for q in questions:
        q_id = str(q.get("id"))
        correct_idx = q.get("correct_index", 0)
        user_choice = user_answers.get(q_id)

        is_correct = (user_choice == correct_idx)
        if is_correct:
            correct_count += 1

        feedback.append({
            "question_id": q_id,
            "user_choice": user_choice,
            "correct_choice": correct_idx,
            "is_correct": is_correct,
            "explanation": q.get("explanation", "")
        })

    score_percent = int((correct_count / total_questions) * 100)
    passed = score_percent >= quiz.passing_score
    xp_awarded = quiz.xp_bounty if passed else 25  # participation XP

    attempt = QuizAttempt.objects.create(
        quiz=quiz,
        learner_callsign=callsign,
        score_percent=score_percent,
        passed=passed,
        xp_awarded=xp_awarded,
        answers_submitted=user_answers
    )

    # Award learner XP
    profile, _ = LearnerProfile.objects.get_or_create(callsign=callsign)
    profile.current_xp += xp_awarded
    profile.save()

    return Response({
        "attempt_id": attempt.id,
        "score_percent": score_percent,
        "passed": passed,
        "passing_score": quiz.passing_score,
        "correct_count": correct_count,
        "total_questions": total_questions,
        "xp_awarded": xp_awarded,
        "total_learner_xp": profile.current_xp,
        "level": profile.level,
        "feedback": feedback
    })

