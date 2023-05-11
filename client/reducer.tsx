import { ReactComponentElement } from "react";
import { combineReducers } from "redux";
import PieChart from "./components/widgets/PieChart/pieChart";
import BarChart from "./components/widgets/BarChart/barChart";
import LineChart from "./components/widgets/LineChart/lineChart";
import ProgressChart from "./components/widgets/Progress/progressChart";
import randomAlphaNumeric from "./utils/randomizer";

const initialStateProgress = {
  userInput: "",
  percentage: 0,
};

const progressChartReducer = (state = initialStateProgress, action) => {
  if (action.type === "GENERATE") {
    const newState = {
      userInput: action.payload.inputValue,
      percentage: action.payload.percent,
    };
    return newState;
  }

  return state;
};

const initialStateBar = {
  option1: "",
  option2: "",
  option3: "",
  monthsArray: [],
};

const barChartReducer = (state = initialStateBar, action) => {
  if (action.type === "SET_BAR_OPTION") {
    const newState = {
      ...state,
      option1: action.payload.option1,
      option2: action.payload.option2,
      option3: action.payload.option3,
    };
    return newState;
  }
  if (action.type === "SET_MONTH") {
    console.log("payload", action.payload);
    return {
      ...state,
      monthsArray: action.payload,
    };
  }
  return state;
};

function stringifyWidgets(newState) {
  return JSON.stringify(
    newState.map((item) => {
      let widgetType = item.type.name;
      let toSave = {} as { widgetType: string };
      toSave.widgetType = widgetType;
      Object.assign(toSave, item);
      return toSave;
    })
  );
}



const widgetReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_WIDGET":
      window.localStorage.setItem("widgets",
        stringifyWidgets(state.concat([action.payload]))
      );
      const result = state.concat([action.payload]);
      console.log(result);
      return result;
    case "REMOVE_WIDGET":
      let newSelection = state.filter(element => action.payload !== element.props.id);
      window.localStorage.setItem("widgets",
        stringifyWidgets(newSelection)
      );
      return newSelection;
    case "REPOPULATE_DASHBOARD":
      let savedWidgetsData = JSON.parse(window.localStorage.getItem("widgets"));
      let restoredWidgets = savedWidgetsData.map((item) => {
        if (item.widgetType === "PieChart") {
          return <PieChart {...item.props} key={randomAlphaNumeric()} />
        } else if (item.type.name === "BarChart") {
          return <BarChart {...item.props} key={randomAlphaNumeric()} />
        } else if (item.type.name === "LineChart") {
          return <LineChart {...item.props} key={randomAlphaNumeric()} />
        } else if (item.type.name === "ProgressChart") {
          return <ProgressChart {...item.props} key={randomAlphaNumeric()} />
        } else {
          return null;
        };
      });
      console.log(restoredWidgets);
      return restoredWidgets;
    default: return state;
  }
}

const currentTabReducer = (state = 'dashboard', action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_TAB':
      state = action.payload;
      return state;
    default: return state;

  }
};

const rootReducer = combineReducers({
  progressChart: progressChartReducer,
  barChart: barChartReducer,
  widgetSelection: widgetReducer,

  currentTab: currentTabReducer

});

export default rootReducer;
