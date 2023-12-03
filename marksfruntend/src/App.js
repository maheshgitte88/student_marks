import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentInfo from './Pages/StudentInfo';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<StudentInfo />} />
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import CounselorWiseSummary from './dsr/CounselorWiseSummary';
// import OverallSummary from './dsr/OverallSummary';
// import OverAllUsingDataTable from './dsr/OverAllUsingDataTable';
// import TltmInd from './dsr/TltmInd';
// import TltmExclude from './dsr/TltmExclude';
// import GroupWise from './dsr/GroupWise';
// import UploadComponent from './dsr/UploadComponent';

// function App() {


//   return (

//     <div className="App">
//       {/* <BrowserRouter> */}
//         <Routes>
//           <Route exact path="/" element={<CounselorWiseSummary />} />
//           <Route exact path="/overall" element={<OverallSummary />} />
//           <Route exact path="/overall-Data-Table" element={<OverAllUsingDataTable />} />
//           <Route exact path="/tltm" element={<TltmInd />} />
//           <Route exact path="/Excluding-TL" element={<TltmExclude />} />
//           <Route exact path="/group-wise" element={<GroupWise />} />
//           <Route exact path="/Data-Files" element={<UploadComponent />} />
//         </Routes>
//       {/* </BrowserRouter> */}

//     </div>


//   );
// }

// export default App;