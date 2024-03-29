import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Budgets = create(
  persist(
    (set, get) => ({
      budgets: [],
      budgetIdx: 0,
      setBudgetIdx: async (idx) => set({ ...get().budgets, budgetIdx: idx }),

      addBudget: async (budget) => set({ budgets: [...get().budgets, budget] }),
      updateBudget: async (idx, newBudget) =>
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === idx
              ? { ...newBudget, transactions: budget.transactions }
              : budget;
          }),
        }),
      delBudget: async (idx) => {
        set({
          budgets: get().budgets.filter((_, i) => !(idx === i)),
          budgetIdx: idx === 0 ? 0 : idx - 1,
        });
      },
      addTransac: async (budget_idx, transac) => {
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === budget_idx
              ? {
                  ...budget,
                  oldvalue: parseFloat(budget.newvalue),
                  newvalue:
                    parseFloat(budget.newvalue) + parseFloat(transac.value),
                  transactions: [...budget.transactions, transac],
                }
              : budget;
          }),
        });
      },
      updateTransac: async (idx, newTransac) =>
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === get().budgetIdx
              ? {
                  ...budget,
                  transactions: budget.transactions.map((transac, j) => {
                    return j == idx ? newTransac : transac;
                  }),
                }
              : budget;
          }),
        }),
      delTransac: async (budget_idx, tr_idx, trv) =>
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === budget_idx
              ? {
                  ...budget,
                  oldvalue: parseFloat(budget.oldvalue) - trv,
                  newvalue: parseFloat(budget.newvalue) - trv,
                  transactions: budget.transactions.filter((_, i) => {
                    return i !== tr_idx;
                  }),
                }
              : budget;
          }),
        }),
      addCat: async (budget_idx, cat) =>
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === budget_idx
              ? {
                  ...budget,
                  categories: [...budget.categories, cat],
                }
              : budget;
          }),
        }),
      delCat: async (budget_idx, cat_idx) =>
        set({
          budgets: get().budgets.map((budget, i) =>
            i === budget_idx
              ? {
                  ...budget,
                  categories: budget.categories.filter((_, i) => {
                    return i !== cat_idx;
                  }),
                }
              : budget
          ),
        }),
      addGoal: async (budget_idx, goal) => {
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === budget_idx
              ? {
                  ...budget,
                  goals: [...budget.goals, goal],
                }
              : budget;
          }),
        });
      },
      delGoal: async (budget_idx, goal_idx) => {
        set({
          budgets: get().budgets.map((budget, i) =>
            i === budget_idx
              ? {
                  ...budget,
                  goals: budget.goals.filter((_, i) => {
                    return i !== goal_idx;
                  }),
                }
              : budget
          ),
        });
      },
      purgeAll: async () => set({ budgets: [], budgetIdx: 0 }),
    }),
    {
      name: "budgi_budget__.data",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const AppSettings = create(
  persist(
    (set, get) => ({
      currency: "USD",
      symbol: "$",
      setCurrency: async (curr) => set({ currency: curr }),
      setSymbol: async (sym) => set({ symbol: sym }),
    }),
    {
      name: "budgi_settings.data",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { Budgets, AppSettings };
