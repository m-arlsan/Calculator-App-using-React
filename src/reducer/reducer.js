import ACTIONS from "./action";
import evaluate from "../evaluation/evaluate";

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }

      if (state.currentOperand === "0" && payload.digit === "0") return state;

      if (state.currentOperand == null && payload.digit === ".") {
        return {
          ...state,
          currentOperand: `0${payload.digit}`,
        };
      }

      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return "";

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }

      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: null,
        };

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.previousOperand == null && state.currentOperand == null) {
        if (payload.operation === "-") {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: "0",
          };
        }
        return "";
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (state.currentOperand == null) {
        return {
          ...state,
          currentOperand: state.previousOperand,
          previousOperand: null,
          operation: null,
          overwrite: true,
        };
      }

      if (state.previousOperand == null && state.operation == null) {
        return {
          ...state,
          currentOperand: state.currentOperand,
          overwrite: true,
        };
      }

      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
        overwrite: true,
      };

    default:
      return "";
  }
}

export default reducer;
