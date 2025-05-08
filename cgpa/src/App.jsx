import FootNote from "./FootNote";
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-grow flex-col p-4 justify-center">
        <h1 className="text-6xl font-bold font-mono">CGPA CALCULATOR</h1>
        <div>
          <p>Grade points</p>
          <p>Credits completed</p>
          <p>Total credits</p>
          {/* 
              bss in media journalism - 129
              ba in english - 123
              bpharm - 199
              eee - 130
              cee - 149
              architechture - 170
            */}
          <p>Current cgpa</p>
          <p>Maximum acheivable cgpa</p>
          <p>Target cgpa</p>
        </div>
      </main>
      <FootNote />
    </div>
  );
}

export default App;
