import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getProgrammingLanguages,
    getQuestionsByLanguage,
    getUserProgress
} from "../services/questionService";

export default function QuestionsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { search } = useLocation();

    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeIndex, setActiveIndex] = useState(null);
    const [progressData, setProgressData] = useState({ progressPercentage: 0, completedQuestions: 0, totalQuestions: 0, progressDetails: [] });

    // must be logged‑in
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { message: "Please log in to access challenges." } });
        }
    }, [user, navigate]);

    // load languages
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const langs = await getProgrammingLanguages();
                setLanguages(langs);

                // restore from ?languageId=…
                const params = new URLSearchParams(search);
                const id = parseInt(params.get("languageId"));
                const pick = langs.find(l => l.id === id) || langs[0];
                setSelectedLanguage(pick);
            } catch {
                setError("Could not load languages");
            } finally {
                setLoading(false);
            }
        })();
    }, [search]);

    // load questions & progress
    useEffect(() => {
        if (!selectedLanguage) return;
        (async () => {
            try {
                setLoading(true);
                const qs = await getQuestionsByLanguage(selectedLanguage.id);
                let prog = [];
                try {
                    prog = (await getUserProgress(selectedLanguage.id)).progressDetails;
                } catch { /* ignore */ }

                const map = Object.fromEntries(
                    prog.map(p => [p.question.id, { status: p.status, score: p.score }])
                );
                setQuestions(qs.map(q => ({ ...q, progress: map[q.id] || { status: "NOT_STARTED", score: 0 } })));
            } catch {
                setError("Could not load questions");
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedLanguage]);

    const onLangChange = e => {
        const id = parseInt(e.target.value);
        navigate(`/questions?languageId=${id}`, { replace: true });
    };

    const toggle = i => setActiveIndex(idx => (idx === i ? null : i));

    const diffClass = d => ({ EASY: "bg-success", MEDIUM: "bg-warning text-dark", HARD: "bg-danger" }[d] || "");
    const diffIcon  = d => ({ EASY: "fas fa-smile", MEDIUM: "fas fa-meh", HARD: "fas fa-frown" }[d] || "fas fa-question");
    const statusClass = s => ({ COMPLETED: "status-completed", IN_PROGRESS: "status-in-progress" }[s] || "status-not-started");
    const statusLabel = s => ({ COMPLETED: "Completed", IN_PROGRESS: "In Progress", NOT_STARTED: "Not Started" }[s] || "");

    return (
        <div className="container mt-5">
            <h3>Practice Coding</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div>Loading…</div>
            ) : (
                <>
                    <select className="form-select mb-4" onChange={onLangChange} value={selectedLanguage?.id}>
                        {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>

                    <div className="accordion">
                        {questions.map((q,i) => (
                            <div className="accordion-item mb-2" key={q.id}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        onClick={() => toggle(i)}
                                    >
                                        <i className={`${diffIcon(q.difficulty)} me-2`}></i>
                                        {q.title}
                                        <span className={`badge ms-2 ${diffClass(q.difficulty)}`}>{q.difficulty}</span>
                                        <span className={`badge ms-2 ${statusClass(q.progress.status)}`}>
                      {statusLabel(q.progress.status)}
                    </span>
                                    </button>
                                </h2>
                                <div className={`accordion-collapse collapse ${activeIndex===i?"show":""}`}>
                                    <div className="accordion-body">
                                        {q.description}
                                        <Link className="btn btn-primary mt-3" to={`/questions/${q.id}/attempt`}>
                                            {q.progress.status==="COMPLETED"?"Revisit":"Start"} Challenge
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

}