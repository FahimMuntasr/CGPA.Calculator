import { useState } from "react";
import FootNote from "./FootNote";

function App() {
  console.log("Hello world");
  const [gradeMap, setGradeMap] = useState({
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  });

  const [data, setData] = useState({
    currentCGPA: "",
    creditsCompleted: "",
    totalCredits: "",
  });
  const [newCgpa, setCgpa] = useState(0.0);
  const [gradePoints, setGradePoints] = useState(0.0);
  const [maxCgpa, setMaxCgpa] = useState(4.0);
  const [targetCgpa, setTargetCgpa] = useState(""); // New state
  const [requiredGpa, setRequiredGpa] = useState(null); // New state
  const [assumedGrade, setAssumedGrade] = useState("A");
  const [courses, setCourses] = useState([
    {
      name: "",
      credits: 0,
      grade: "",
    },
  ]);
  const [newGrade, setNewGrade] = useState("");
  const [newValue, setNewValue] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", credits: 0, grade: "" }]);
  };

  const removeCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const calculateGradePoints = () => {
    const { currentCGPA, creditsCompleted, totalCredits } = data;
    const cgpa = parseFloat(currentCGPA);
    const completedCredits = parseFloat(creditsCompleted);
    let totalGradePoints = parseFloat((cgpa * completedCredits).toFixed(2));
    let totalEarnedCredits = completedCredits;

    courses.forEach((course) => {
      const gradeValue = gradeMap[course.grade.toUpperCase()];
      const creditValue = parseFloat(course.credits);
      if (!isNaN(gradeValue) && !isNaN(creditValue)) {
        totalGradePoints += gradeValue * creditValue;
        totalEarnedCredits += creditValue;
      }
    });
    const newCGPA = totalGradePoints / totalEarnedCredits;
    const assumedGradeValue = gradeMap[assumedGrade.toUpperCase()] ?? 4.0;
    const maxPossibleGradePoints =
      assumedGradeValue * (totalCredits - totalEarnedCredits) +
      totalGradePoints;
    const maxPossibleCGPA = maxPossibleGradePoints / totalCredits;

    setGradePoints(parseFloat(totalGradePoints.toFixed(2)));
    setCgpa(newCGPA.toFixed(2));
    setMaxCgpa(maxPossibleCGPA);

    // Calculate required GPA to reach target CGPA
    const target = parseFloat(targetCgpa);
    if (!isNaN(target) && totalCredits > totalEarnedCredits) {
      const neededTotalGradePoints = target * totalCredits;
      const remainingCredits = totalCredits - totalEarnedCredits;
      const neededGradePoints = neededTotalGradePoints - totalGradePoints;
      const gpaNeeded = neededGradePoints / remainingCredits;

      setRequiredGpa(gpaNeeded > 4 ? "Impossible" : gpaNeeded.toFixed(2));
    } else {
      setRequiredGpa(null);
    }
    console.log(gradePoints);
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <main className="flex flex-grow flex-col w-full p-4 justify-center items-center">
        <h1 className="text-6xl text-center font-bold pb-10">
          CGPA CALCULATOR
        </h1>

        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-b-4 pb-10 mb-10 border-[#283618]">
            <input
              type="number"
              name="currentCGPA"
              placeholder="Current CGPA"
              value={data.currentCGPA}
              onChange={handleChange}
              className="px-4 py-2 border w-full border-[#283618] rounded"
            />
            <input
              type="number"
              name="creditsCompleted"
              placeholder="Credits completed"
              value={data.creditsCompleted}
              onChange={handleChange}
              className="px-4 py-2 border w-full border-[#283618] rounded"
            />
            <input
              type="number"
              name="totalCredits"
              placeholder="Total credits"
              value={data.totalCredits}
              onChange={handleChange}
              className="px-4 py-2 border w-full border-[#283618] rounded"
            />
            <input
              type="number"
              placeholder="Target CGPA"
              value={targetCgpa}
              onChange={(e) => setTargetCgpa(e.target.value)}
              className="px-4 py-2 border w-full border-[#283618] rounded"
            />
          </div>

          <div className="w-full max-w-3xl flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4">Courses</h2>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 items-end"
                >
                  <div className="flex flex-col w-full justify-center items-center">
                    <p className="w-full">Course Name (optional)</p>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) =>
                        handleCourseChange(index, "name", e.target.value)
                      }
                      className="px-3 py-2 border border-[#283618] rounded w-full"
                    />
                  </div>
                  <div className="flex flex-row w-full sm:w-1/2 justify-between">
                    <div className="flex flex-col">
                      <p>Credits</p>
                      <input
                        type="number"
                        value={course.credits}
                        onChange={(e) =>
                          handleCourseChange(index, "credits", e.target.value)
                        }
                        className="px-3 py-2 border border-[#283618] rounded w-24 sm:w-16"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p>Grade</p>
                      <input
                        type="text"
                        value={course.grade}
                        onChange={(e) =>
                          handleCourseChange(index, "grade", e.target.value)
                        }
                        className="px-3 py-2 border border-[#283618] rounded w-24 sm:w-16"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-800 w-full sm:w-20"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/3 flex flex-row justify-center ">
            <button
              type="submit"
              onClick={addCourse}
              className="mt-4 mr-4 px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-800"
            >
              Add course
            </button>
            <button
              type="submit"
              onClick={calculateGradePoints}
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-800"
            >
              Calculate
            </button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <label className="text-sm mb-1">
              Assumed Grade for Remaining Courses
            </label>
            <select
              value={assumedGrade}
              onChange={(e) => setAssumedGrade(e.target.value)}
              className="px-4 py-2 border border-[#283618] rounded"
            >
              {Object.keys(gradeMap).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full max-w-2xl mt-10 px-6 py-4 bg-[#fefae0]">
            <h2 className="text-3xl font-semibold text-center text-[#283618] mb-4">
              Results
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
              <div className="flex flex-col items-center w-full">
                <p className="text-md text-gray-600">New CGPA</p>
                <p className="text-3xl font-bold text-[#606c38]">{newCgpa}</p>
              </div>
              <div className="flex flex-col items-center w-full">
                <p className="text-md text-gray-600">Max CGPA </p>
                <p className="text-3xl font-bold text-[#606c38]">
                  {maxCgpa.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-center w-full">
                <p className="text-md text-gray-600">GPA Needed for Target</p>
                <p className="text-3xl font-bold text-[#bc6c25]">
                  {requiredGpa ?? "--"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-2xl mx-auto mt-10 px-6 py-4 ">
          <h2 className="text-3xl font-semibold text-center text-[#283618] mb-4">
            Editable Grade Mapping
          </h2>
          <table className="w-full border-2 border-[#283618]">
            <thead className="">
              <tr>
                <th className="border border-[#283618] p-2">GPA Value</th>
                <th className="border border-[#283618] p-2">Grade</th>
                <th className="border border-[#283618] p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gradeMap).map(([grade, value]) => (
                <tr key={grade}>
                  <td className="border p-2 border-[#283618]">
                    <input
                      type="text"
                      value={grade}
                      disabled
                      className="w-full p-1 border rounded bg-gray-100"
                    />
                  </td>
                  <td className="border p-2 border-[#283618]">
                    <input
                      type="number"
                      value={value}
                      min="0"
                      max="4"
                      step="0.1"
                      onChange={(e) => {
                        const updatedMap = { ...gradeMap };
                        updatedMap[grade] = parseFloat(e.target.value);
                        setGradeMap(updatedMap);
                      }}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2 text-center text-red-600 border-[#283618]">
                    <button
                      onClick={() => {
                        const updatedMap = { ...gradeMap };
                        delete updatedMap[grade];
                        setGradeMap(updatedMap);
                      }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border p-2 border-[#283618]">
                  <input
                    type="text"
                    placeholder="New Grade"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value.toUpperCase())}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2 border-[#283618]">
                  <input
                    type="number"
                    placeholder="GPA"
                    min="0"
                    max="4"
                    step="0.1"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => {
                      if (newGrade && !isNaN(parseFloat(newValue))) {
                        setGradeMap({
                          ...gradeMap,
                          [newGrade]: parseFloat(newValue),
                        });
                        setNewGrade("");
                        setNewValue("");
                      }
                    }}
                    className="text-green-600"
                  >
                    ➕
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <FootNote />
    </div>
  );
}

export default App;
