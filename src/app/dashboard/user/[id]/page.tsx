    "use client";

    import { useState, useEffect } from "react";
    import { notFound } from "next/navigation";
    import { users } from "@/lib/data";
    import { motion, AnimatePresence } from "framer-motion";

    interface Props {
    params: { id: string };
    }

    interface Exercise {
    muscle: string;
    movement: string;
    sets: string;
    reps: string;
    }

    interface TrainingDay {
    day: number;
    exercises: Exercise[];
    }

    interface NutritionItem {
    meal: string;
    time: string;
    notes: string;
    }

    const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    };

    const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
    };
    export default function UserDetailPage({ params }: Props) {
    const user = users.find((u) => u.id === Number(params.id));
    if (!user) return notFound();

    const storageKey = `userPlans_${user.id}`;

    const [trainingPlan, setTrainingPlan] = useState<TrainingDay[]>([
        {
        day: 1,
        exercises: [{ muscle: "", movement: "", sets: "", reps: "" }],
        },
    ]);
    const [trainingPlanEditMode, setTrainingPlanEditMode] = useState<boolean[]>([
        true,
    ]); // <--- change here

    const [nutritionPlan, setNutritionPlan] = useState<NutritionItem[]>([
        { meal: "", time: "", notes: "" },
    ]);
    const [nutritionEditMode, setNutritionEditMode] = useState<boolean[]>([true]); // <--- change here

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.trainingPlan && parsed.nutritionPlan) {
            setTrainingPlan(parsed.trainingPlan);
            setTrainingPlanEditMode(parsed.trainingPlan.map(() => false));
            setNutritionPlan(parsed.nutritionPlan);
            setNutritionEditMode(parsed.nutritionPlan.map(() => false));
            }
        } catch {
            // ignore parse errors
        }
        }
    }, [storageKey]);

    // Save data to localStorage
    const savePlans = () => {
        if (typeof window === "undefined") return;
        localStorage.setItem(
        storageKey,
        JSON.stringify({ trainingPlan, nutritionPlan })
        );
        // Reset all edit modes
        setTrainingPlanEditMode(trainingPlan.map(() => false));
        setNutritionEditMode(nutritionPlan.map(() => false));
    };

    // --- Training Plan Handlers ---

    // Add day
    const addDay = () => {
        setTrainingPlan((prev) => [
        ...prev,
        {
            day: prev.length + 1,
            exercises: [{ muscle: "", movement: "", sets: "", reps: "" }],
        },
        ]);
        setTrainingPlanEditMode((prev) => [...prev, true]); // new day starts in edit mode
    };

    // Delete day
    const deleteDay = (dayIndex: number) => {
        setTrainingPlan((prev) => {
        const updated = prev.filter((_, i) => i !== dayIndex);
        // Reassign day numbers
        return updated.map((day, i) => ({ ...day, day: i + 1 }));
        });
        setTrainingPlanEditMode((prev) => prev.filter((_, i) => i !== dayIndex));
    };

    // Toggle edit mode for a day
    const toggleEditDay = (dayIndex: number) => {
        setTrainingPlanEditMode((prev) =>
        prev.map((edit, i) => (i === dayIndex ? !edit : edit))
        );
    };

    // Add exercise to a day
    const addExercise = (dayIndex: number) => {
        const updated = [...trainingPlan];
        updated[dayIndex].exercises.push({
        muscle: "",
        movement: "",
        sets: "",
        reps: "",
        });
        setTrainingPlan(updated);
        // Also force edit mode on that day
        setTrainingPlanEditMode((prev) =>
        prev.map((edit, i) => (i === dayIndex ? true : edit))
        );
    };

    // Delete exercise from a day
    const deleteExercise = (dayIndex: number, exIndex: number) => {
        const updated = [...trainingPlan];
        updated[dayIndex].exercises = updated[dayIndex].exercises.filter(
        (_, i) => i !== exIndex
        );
        setTrainingPlan(updated);
    };

    // Update exercise field
    const updateExercise = (
        dayIndex: number,
        exIndex: number,
        field: keyof Exercise,
        value: string
    ) => {
        const updated = [...trainingPlan];
        updated[dayIndex].exercises[exIndex][field] = value;
        setTrainingPlan(updated);
    };

    // --- Nutrition Plan Handlers ---

    // Add meal
    const addMeal = () => {
        setNutritionPlan((prev) => [...prev, { meal: "", time: "", notes: "" }]);
        setNutritionEditMode((prev) => [...prev, true]); // new meal starts editable
    };

    // Delete meal
    const deleteMeal = (index: number) => {
        setNutritionPlan((prev) => prev.filter((_, i) => i !== index));
        setNutritionEditMode((prev) => prev.filter((_, i) => i !== index));
    };

    // Toggle meal edit mode
    const toggleEditMeal = (index: number) => {
        setNutritionEditMode((prev) =>
        prev.map((edit, i) => (i === index ? !edit : edit))
        );
    };

    // Update meal field
    const updateMeal = (
        index: number,
        field: keyof NutritionItem,
        value: string
    ) => {
        const updated = [...nutritionPlan];
        updated[index][field] = value;
        setNutritionPlan(updated);
    };

    return (
        <motion.div
        className="min-h-screen bg-black text-white p-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.4 }}
        >
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <motion.div
            className="space-y-2 bg-white/10 p-6 rounded-lg mb-10"
            variants={itemVariants}
        >
            <p>
            <span className="text-white/70">Name:</span> {user.name}
            </p>
            <p>
            <span className="text-white/70">Email:</span> {user.email}
            </p>
            <p>
            <span className="text-white/70">Role:</span> {user.role}
            </p>
            <p>
            <span className="text-white/70">Joined:</span> {user.joinedAt}
            </p>
        </motion.div>

        {/* TRAINING PLAN */}
        <h2 className="text-2xl font-semibold mb-4">Training Plan</h2>
        <AnimatePresence>
            {trainingPlan.map((day, dayIdx) => (
            <motion.div
                key={day.day}
                className="mb-8 bg-white/5 p-4 rounded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
            >
                <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">Day {day.day}</h3>
                <div className="space-x-2">
                    <button
                    onClick={() => toggleEditDay(dayIdx)}
                    className="text-yellow-400 hover:underline"
                    >
                    {trainingPlanEditMode[dayIdx] ? "Save" : "Edit"}
                    </button>
                    <button
                    onClick={() => deleteDay(dayIdx)}
                    className="text-red-500 hover:underline"
                    >
                    Delete Day
                    </button>
                </div>
                </div>
                <AnimatePresence>
                {day.exercises.map((ex, exIdx) => (
                    <motion.div
                    key={exIdx}
                    className="grid grid-cols-4 gap-4 mb-2 items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    >
                    {trainingPlanEditMode[dayIdx] ? (
                        <>
                        <input
                            className="bg-black border border-white/20 p-2 rounded"
                            placeholder="Muscle"
                            value={ex.muscle}
                            onChange={(e) =>
                            updateExercise(
                                dayIdx,
                                exIdx,
                                "muscle",
                                e.target.value
                            )
                            }
                        />
                        <input
                            className="bg-black border border-white/20 p-2 rounded"
                            placeholder="Movement"
                            value={ex.movement}
                            onChange={(e) =>
                            updateExercise(
                                dayIdx,
                                exIdx,
                                "movement",
                                e.target.value
                            )
                            }
                        />
                        <input
                            className="bg-black border border-white/20 p-2 rounded"
                            placeholder="Sets"
                            value={ex.sets}
                            onChange={(e) =>
                            updateExercise(dayIdx, exIdx, "sets", e.target.value)
                            }
                        />
                        <div className="flex items-center gap-2">
                            <input
                            className="bg-black border border-white/20 p-2 rounded w-full"
                            placeholder="Reps"
                            value={ex.reps}
                            onChange={(e) =>
                                updateExercise(
                                dayIdx,
                                exIdx,
                                "reps",
                                e.target.value
                                )
                            }
                            />
                            <button
                            onClick={() => deleteExercise(dayIdx, exIdx)}
                            className="text-red-500 hover:underline"
                            aria-label="Delete exercise"
                            type="button"
                            >
                            Delete
                            </button>
                        </div>
                        </>
                    ) : (
                        <>
                        <p>{ex.muscle || "-"}</p>
                        <p>{ex.movement || "-"}</p>
                        <p>{ex.sets || "-"}</p>
                        <p>{ex.reps || "-"}</p>
                        </>
                    )}
                    </motion.div>
                ))}
                </AnimatePresence>
                {trainingPlanEditMode[dayIdx] && (
                <button
                    onClick={() => addExercise(dayIdx)}
                    className="mt-2 text-green-400 hover:underline"
                    type="button"
                >
                    + Add Exercise
                </button>
                )}
            </motion.div>
            ))}
        </AnimatePresence>
        <button
            onClick={addDay}
            className="mb-12 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
            type="button"
        >
            + Add Day
        </button>

        {/* NUTRITION PLAN */}
        <h2 className="text-2xl font-semibold mb-4">Nutrition Plan</h2>
        <AnimatePresence>
            {nutritionPlan.map((meal, idx) => (
            <motion.div
                key={idx}
                className="mb-6 bg-white/5 p-4 rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
            >
                <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Meal {idx + 1}</h3>
                <div className="space-x-2">
                    <button
                    onClick={() => toggleEditMeal(idx)}
                    className="text-yellow-400 hover:underline"
                    >
                    {nutritionEditMode[idx] ? "Save" : "Edit"}
                    </button>
                    <button
                    onClick={() => deleteMeal(idx)}
                    className="text-red-500 hover:underline"
                    >
                    Delete Meal
                    </button>
                </div>
                </div>
                {nutritionEditMode[idx] ? (
                <div className="grid grid-cols-3 gap-4">
                    <input
                    className="bg-black border border-white/20 p-2 rounded"
                    placeholder="Meal"
                    value={meal.meal}
                    onChange={(e) => updateMeal(idx, "meal", e.target.value)}
                    />
                    <input
                    className="bg-black border border-white/20 p-2 rounded"
                    placeholder="Time"
                    value={meal.time}
                    onChange={(e) => updateMeal(idx, "time", e.target.value)}
                    />
                    <input
                    className="bg-black border border-white/20 p-2 rounded"
                    placeholder="Notes"
                    value={meal.notes}
                    onChange={(e) => updateMeal(idx, "notes", e.target.value)}
                    />
                </div>
                ) : (
                <div className="grid grid-cols-3 gap-4">
                    <p>{meal.meal || "-"}</p>
                    <p>{meal.time || "-"}</p>
                    <p>{meal.notes || "-"}</p>
                </div>
                )}
            </motion.div>
            ))}
        </AnimatePresence>
        <button
            onClick={addMeal}
            className="mb-10 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
            type="button"
        >
            + Add Meal
        </button>

        {/* SAVE BUTTON */}
        <button
            onClick={savePlans}
            className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors font-semibold"
            type="button"
        >
            Save All Changes
        </button>
        </motion.div>
    );
    }
