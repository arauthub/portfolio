import { Component, inject, OnInit, signal, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { GamificationService } from '../../core/services/gamification.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { Course, LessonDetail, QuizData, QuizSubmissionResult } from '../../core/models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
        <a routerLink="/courses" (click)="sound.playClick()" class="hover:text-[var(--neon-primary)]">Courses</a>
        <span>/</span>
        <span class="text-[var(--neon-primary)]">{{ course()?.title }}</span>
      </div>

      <!-- Main Workspace Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Syllabus Sidebar -->
        <div class="glass-panel p-5 space-y-4 h-fit">
          <div>
            <span class="text-[10px] font-mono tracking-wider uppercase text-[var(--neon-primary)]">
              CURRICULUM SYLLABUS
            </span>
            <h3 class="font-display font-bold text-sm text-white mt-1">
              {{ course()?.title }}
            </h3>
            <div class="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
              <span>★ Total: +{{ course()?.xp_reward }} XP</span>
              <span class="text-purple-400">{{ course()?.difficulty }}</span>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-800">
            @for (lesson of course()?.lessons; track lesson.id) {
              <button 
                (click)="selectLesson(lesson.id)"
                [class.active-lesson]="selectedLessonId() === lesson.id"
                class="w-full text-left p-3 rounded-lg border border-slate-800/80 bg-[#060a16] hover:border-[var(--neon-primary)]/50 transition-all flex items-center justify-between group">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded flex items-center justify-center text-xs font-mono bg-slate-800 text-slate-300 group-hover:text-[var(--neon-primary)]">
                    0{{ lesson.order }}
                  </div>
                  <div>
                    <div class="text-xs font-display font-bold text-slate-200 line-clamp-1 group-hover:text-white">
                      {{ lesson.title }}
                    </div>
                    <div class="text-[10px] font-mono text-slate-500">
                      {{ lesson.estimated_minutes }} mins • +{{ lesson.xp_value }} XP
                    </div>
                  </div>
                </div>

                @if (isLessonCompleted(lesson.id)) {
                  <span class="text-xs text-emerald-400">✓</span>
                }
              </button>
            }
          </div>

          <div class="pt-4 border-t border-slate-800 text-center">
            <a routerLink="/certificate" (click)="sound.playClick()" class="cyber-btn cyber-btn-secondary text-[11px] w-full">
              Preview Certificate 📜
            </a>
          </div>
        </div>

        <!-- Interactive Lesson Player Workspace -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Lesson Title & XP Bar -->
          <div class="cyber-card flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-xs font-mono text-[var(--neon-primary)]">
                <span>MODULE 0{{ activeLesson()?.order }}</span>
                <span>•</span>
                <span class="text-slate-400">{{ activeLesson()?.estimated_minutes }} MINUTES</span>
                <span>•</span>
                <span class="text-amber-400 font-bold">+{{ activeLesson()?.xp_value }} XP BOUNTY</span>
              </div>
              <h2 class="text-2xl font-display font-bold text-white mt-1">
                {{ activeLesson()?.title }}
              </h2>
            </div>

            <!-- Complete Lesson Action Button -->
            <button 
              (click)="completeCurrentLesson()"
              [disabled]="isLessonCompleted(selectedLessonId())"
              class="cyber-btn"
              [class.bg-emerald-500]="isLessonCompleted(selectedLessonId())"
              [class.text-white]="isLessonCompleted(selectedLessonId())">
              {{ isLessonCompleted(selectedLessonId()) ? '✓ Completed (+XP Claimed)' : 'Mark Module Complete 🚀' }}
            </button>
          </div>

          <!-- Interactive Workspace Tabs -->
          <div class="glass-panel p-6 space-y-6">
            
            <div class="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto whitespace-nowrap">
              <button 
                (click)="activeTab.set('interactive')" 
                [class.active-tab]="activeTab() === 'interactive'"
                class="tab-btn flex-shrink-0">
                💻 Hands-On Sandbox
              </button>
              <button 
                (click)="activeTab.set('simulation')" 
                [class.active-tab]="activeTab() === 'simulation'"
                class="tab-btn flex-shrink-0">
                🔮 3D Holographic Sim
              </button>
              <button 
                (click)="activeTab.set('assessment')" 
                [class.active-tab]="activeTab() === 'assessment'"
                class="tab-btn flex-shrink-0">
                ⚡ Cyber Assessment
              </button>
              <button 
                (click)="activeTab.set('concept')" 
                [class.active-tab]="activeTab() === 'concept'"
                class="tab-btn flex-shrink-0">
                📖 Concept Telemetry
              </button>
            </div>

            <!-- TAB 1: INTERACTIVE CODE SANDBOX -->
            @if (activeTab() === 'interactive') {
              <div class="space-y-4">
                
                <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Interactive Runtime: {{ activeLesson()?.code_language | uppercase }}
                  </span>
                  <button (click)="resetStarterCode()" class="text-slate-400 hover:text-[var(--neon-primary)] text-xs">
                    ↺ Reset Code
                  </button>
                </div>

                <!-- Code Editor Textarea -->
                <div class="relative bg-[#050811] border border-cyan-500/40 rounded-xl overflow-hidden font-mono text-sm">
                  <div class="bg-[#0a0f24] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                      <span class="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                      <span class="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                      <span class="ml-2 text-slate-300 font-mono">quantum_kernel.py</span>
                    </div>
                    <span class="text-[10px] text-[var(--neon-primary)] font-mono">AUTO-SAVING ACTIVATED</span>
                  </div>
                  
                  <textarea 
                    [(ngModel)]="userCode"
                    rows="9"
                    aria-label="Interactive Python Laboratory Code Editor"
                    class="w-full bg-transparent p-4 text-cyan-300 font-mono text-xs sm:text-sm focus:outline-none resize-y"
                    spellcheck="false"></textarea>
                </div>

                <!-- Run Simulation Button -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="text-xs font-mono text-slate-400">
                    Task: <strong class="text-slate-200">{{ activeLesson()?.code_task || 'Execute unitary operator transformations to verify state norms.' }}</strong>
                  </div>
                  <button (click)="executeCode()" class="cyber-btn text-xs flex-shrink-0 w-full sm:w-auto">
                    ▶ Execute Quantum Script
                  </button>
                </div>

                <!-- Terminal Output Window -->
                @if (executionOutput()) {
                  <div role="log" aria-live="polite" class="bg-black/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 overflow-x-auto">
                    <div class="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                      <span>TERMINAL CONSOLE // STDOUT</span>
                      <span class="text-emerald-400">⏱ {{ executionTime() }}ms</span>
                    </div>
                    <pre class="text-slate-300 whitespace-pre-wrap leading-relaxed">{{ executionOutput() }}</pre>
                  </div>
                }

              </div>
            }

            <!-- TAB 2: HOLOGRAPHIC 3D CANVAS SIMULATION -->
            @if (activeTab() === 'simulation') {
              <div class="space-y-4">
                <div class="flex items-center justify-between text-xs font-mono">
                  <span class="text-[var(--neon-primary)]">HOLOGRAM SIMULATOR: QUANTUM PHASE COHERENCE MATRIX</span>
                  <span class="text-slate-400">60 FPS REAL-TIME CANVAS</span>
                </div>

                <div class="relative w-full h-64 bg-[#030612] border border-[var(--neon-primary)]/40 rounded-xl overflow-hidden flex items-center justify-center">
                  <canvas #simCanvas class="w-full h-full"></canvas>
                  <div class="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded border border-cyan-500/30 font-mono text-[11px] text-cyan-300">
                    ψ(t) = α|0⟩ + β|1⟩ e^(iωt)
                  </div>
                </div>

                <!-- Interactive Canvas Controls -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-mono text-slate-400">
                      <span>Qubit Frequency</span>
                      <span class="text-[var(--neon-primary)]">{{ simFrequency }} GHz</span>
                    </div>
                    <input type="range" [(ngModel)]="simFrequency" min="1" max="10" step="0.5" 
                           aria-label="Qubit Frequency in Gigahertz"
                           class="w-full accent-cyan-400 cursor-pointer">
                  </div>
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-mono text-slate-400">
                      <span>Phase Angle (θ)</span>
                      <span class="text-purple-400">{{ simPhase }}°</span>
                    </div>
                    <input type="range" [(ngModel)]="simPhase" min="0" max="360" step="15" 
                           aria-label="Quantum Phase Angle in degrees"
                           class="w-full accent-purple-400 cursor-pointer">
                  </div>
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-mono text-slate-400">
                      <span>Coherence Damping</span>
                      <span class="text-pink-400">{{ simDamping }}</span>
                    </div>
                    <input type="range" [(ngModel)]="simDamping" min="0.1" max="1" step="0.05" 
                           aria-label="Coherence Damping factor"
                           class="w-full accent-pink-400 cursor-pointer">
                  </div>
                </div>
              </div>
            }

            <!-- TAB 3: CYBER ASSESSMENT / QUIZ -->
            @if (activeTab() === 'assessment') {
              <div class="space-y-6">
                
                @if (!quizResult()) {
                  <div class="space-y-5">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 class="font-display font-bold text-base text-white">{{ quizData()?.title }}</h4>
                        <p class="text-xs text-slate-400">Passing Threshold: {{ quizData()?.passing_score }}% • Reward: +{{ quizData()?.xp_bounty }} XP</p>
                      </div>
                      <div class="text-xs font-mono px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg">
                        ⏱ Time Remaining: {{ quizTimer }}s
                      </div>
                    </div>

                    @for (q of quizData()?.questions; track q.id; let idx = $index) {
                      <div class="bg-[#050917] border border-slate-800 rounded-xl p-4 space-y-3">
                        <div class="text-xs font-mono text-[var(--neon-primary)]">QUESTION 0{{ idx + 1 }} OF {{ quizData()?.questions?.length }}</div>
                        <div [id]="'q-prompt-' + q.id" class="text-sm font-display font-semibold text-white">{{ q.prompt }}</div>

                        <div role="radiogroup" [attr.aria-labelledby]="'q-prompt-' + q.id" class="grid grid-cols-1 gap-2 pt-1">
                          @for (opt of q.options; track $index; let oIdx = $index) {
                            <button 
                              type="button"
                              role="radio"
                              [attr.aria-checked]="selectedAnswers[q.id] === oIdx"
                              (click)="selectAnswer(q.id, oIdx)"
                              [class.bg-[var(--neon-primary)]/20]="selectedAnswers[q.id] === oIdx"
                              [class.border-[var(--neon-primary)]]="selectedAnswers[q.id] === oIdx"
                              class="text-left text-xs font-mono p-3 rounded-lg border border-slate-800 bg-[#080d20] hover:border-slate-600 transition-all flex items-center gap-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[var(--neon-primary)]">
                              <span class="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] flex-shrink-0" aria-hidden="true">
                                {{ oIdx === 0 ? 'A' : oIdx === 1 ? 'B' : oIdx === 2 ? 'C' : 'D' }}
                              </span>
                              <span class="text-slate-300">{{ opt }}</span>
                            </button>
                          }
                        </div>
                      </div>
                    }

                    <div class="flex justify-end pt-2">
                      <button (click)="submitQuizAssessment()" class="cyber-btn cyber-btn-accent">
                        Submit Assessment Evaluation ⚡
                      </button>
                    </div>
                  </div>
                } @else {
                  <!-- Quiz Result Screen -->
                  <div class="cyber-card text-center py-8 space-y-5">
                    <div class="text-5xl">
                      {{ quizResult()?.passed ? '🎉' : '⚠️' }}
                    </div>

                    <div>
                      <h3 class="text-2xl font-display font-bold text-white">
                        {{ quizResult()?.passed ? 'Assessment Protocol Passed!' : 'Recalibration Recommended' }}
                      </h3>
                      <div class="text-3xl font-display font-black mt-2" 
                           [class.text-emerald-400]="quizResult()?.passed"
                           [class.text-pink-400]="!quizResult()?.passed">
                        {{ quizResult()?.score_percent }}%
                      </div>
                      <p class="text-xs text-slate-400 mt-1">
                        {{ quizResult()?.correct_count }} of {{ quizResult()?.total_questions }} correct answers verified
                      </p>
                    </div>

                    <div class="inline-block bg-[#050811] border border-[var(--border-hud)] px-6 py-2 rounded-xl text-xs font-mono text-amber-400">
                      ★ XP Awarded: +{{ quizResult()?.xp_awarded }} XP
                    </div>

                    <div class="pt-4 flex justify-center gap-4">
                      <button (click)="retakeQuiz()" class="cyber-btn cyber-btn-secondary text-xs">
                        Retake Assessment
                      </button>
                      <button (click)="activeTab.set('interactive')" class="cyber-btn text-xs">
                        Continue Coding Lab →
                      </button>
                    </div>
                  </div>
                }

              </div>
            }

            <!-- TAB 4: CONCEPT TELEMETRY -->
            @if (activeTab() === 'concept') {
              <div class="prose prose-invert max-w-none text-slate-300 space-y-4 text-xs sm:text-sm font-body leading-relaxed">
                <div class="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                  <h4 class="font-display font-bold text-cyan-300 text-sm">Key Quantum Theorem:</h4>
                  <p class="text-xs text-cyan-100/90 mt-1">
                    Superposition permits qubit state vectors to occupy linear combinations of orthogonal basis states until measurement.
                    When coupled via Controlled-NOT operations, non-local quantum correlations form the basis of quantum telecommunication and accelerated representation learning.
                  </p>
                </div>
                <p>
                  In this module, we examine superconducting transmons cooled to millikelvin temperatures. 
                  Josephson junctions act as non-linear inductors, separating energy transitions so microwaves can manipulate ground and excited states precisely.
                </p>
              </div>
            }

          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .tab-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-family: var(--font-display);
      font-weight: 700;
      color: #94a3b8;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }
    .active-tab {
      color: var(--neon-primary) !important;
      background: rgba(var(--neon-primary-rgb), 0.12) !important;
      border-color: var(--neon-primary) !important;
    }
    .active-lesson {
      border-color: var(--neon-primary) !important;
      background: rgba(var(--neon-primary-rgb), 0.1) !important;
    }
  `]
})
export class CourseDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  public courseService = inject(CourseService);
  public gamification = inject(GamificationService);
  public sound = inject(SoundFxService);

  @ViewChild('simCanvas') simCanvasRef!: ElementRef<HTMLCanvasElement>;

  public currentSlug = signal<string>('quantum-ai-architecture');
  public course = computed(() => {
    const slug = this.currentSlug();
    const list = this.courseService.courses();
    return list.find(c => c.slug === slug) || list[0];
  });
  public selectedLessonId = signal<number>(1);
  public activeLesson = signal<LessonDetail | undefined>(undefined);
  public activeTab = signal<'interactive' | 'simulation' | 'assessment' | 'concept'>('interactive');

  // Code editor state
  public userCode = '';
  public executionOutput = signal<string>('');
  public executionTime = signal<number>(0);

  // Simulation parameters
  public simFrequency = 5.0;
  public simPhase = 45;
  public simDamping = 0.85;
  private animId: number | null = null;

  // Quiz state
  public quizData = signal<QuizData | null>(null);
  public selectedAnswers: Record<string, number> = {};
  public quizResult = signal<QuizSubmissionResult | null>(null);
  public quizTimer = 180;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || 'quantum-ai-architecture';
      this.currentSlug.set(slug);
      const c = this.course();
      if (c && c.lessons && c.lessons.length > 0) {
        this.selectLesson(c.lessons[0].id);
      }
    });

    this.courseService.getQuiz(1).then(q => this.quizData.set(q));
  }

  ngAfterViewInit() {
    this.startSimulation();
  }

  public selectLesson(id: number) {
    this.selectedLessonId.set(id);
    this.courseService.getLessonDetail(id).then(detail => {
      this.activeLesson.set(detail);
      this.userCode = detail.code_starter;
      this.executionOutput.set('');
    });
    this.sound.playClick();
  }

  public isLessonCompleted(id: number): boolean {
    return this.gamification.profile().completed_lessons.includes(id);
  }

  public completeCurrentLesson() {
    const id = this.selectedLessonId();
    const lesson = this.activeLesson();
    const xp = lesson ? lesson.xp_value : 250;

    if (!this.isLessonCompleted(id)) {
      this.gamification.profile.update(p => ({
        ...p,
        completed_lessons: [...p.completed_lessons, id]
      }));
      this.gamification.awardXP(xp, `Completed Module: ${lesson?.title}`);
    }
  }

  public executeCode() {
    const result = this.courseService.runCodeSimulation(this.userCode, this.activeLesson()?.code_language || 'python');
    this.executionOutput.set(result.output);
    this.executionTime.set(result.executionTimeMs);
    this.sound.playSuccess();
  }

  public resetStarterCode() {
    if (this.activeLesson()) {
      this.userCode = this.activeLesson()!.code_starter;
    }
  }

  public selectAnswer(qId: number, oIdx: number) {
    this.selectedAnswers[String(qId)] = oIdx;
    this.sound.playClick();
  }

  public submitQuizAssessment() {
    this.courseService.submitQuiz(1, this.selectedAnswers).then(res => {
      this.quizResult.set(res);
      if (res.passed) {
        this.gamification.awardXP(res.xp_awarded, 'Assessment Passed');
      } else {
        this.sound.playError();
      }
    });
  }

  public retakeQuiz() {
    this.selectedAnswers = {};
    this.quizResult.set(null);
  }

  ngOnDestroy(): void {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  // Real-time canvas quantum simulation with flicker-free stable buffer sizing
  private startSimulation() {
    const render = () => {
      if (this.simCanvasRef && this.simCanvasRef.nativeElement) {
        const canvas = this.simCanvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const targetW = canvas.parentElement?.clientWidth || 600;
          const targetH = canvas.parentElement?.clientHeight || 256;
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const time = Date.now() * 0.002 * (this.simFrequency / 3);
          const centerY = canvas.height / 2;

          // Wave 1: Quantum Probability Amplitude (Google Blue / Neon Cyan)
          ctx.beginPath();
          ctx.strokeStyle = '#1a73e8';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#8ab4f8';
          ctx.shadowBlur = 10;

          for (let x = 0; x < canvas.width; x += 4) {
            const y = centerY + Math.sin(x * 0.02 + time) * 45 * this.simDamping;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Wave 2: Entangled Phase Wave (Purple Neon)
          ctx.beginPath();
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#c58af9';
          ctx.shadowBlur = 8;

          const phaseRad = (this.simPhase * Math.PI) / 180;
          for (let x = 0; x < canvas.width; x += 4) {
            const y = centerY + Math.cos(x * 0.02 + time + phaseRad) * 40 * this.simDamping;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      this.animId = requestAnimationFrame(render);
    };
    render();
  }
}

