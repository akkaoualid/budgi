import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";


function isEqual(obj1, obj2) {
  var props1 = Object.getOwnPropertyNames(obj1);
  var props2 = Object.getOwnPropertyNames(obj2);
  if (props1.length != props2.length) {
      return false;
  }
  for (var i = 0; i < props1.length; i++) {
      let val1 = obj1[props1[i]];
      let val2 = obj2[props1[i]];
      let isObjects = isObject(val1) && isObject(val2);
      if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
          return false;
      }
  }
  return true;
}
function isObject(object) {
return object != null && typeof object === 'object';
}

const Budgets = create(
  persist(
    (set, get) => ({
      budgets: [],
      addBudget: async (budget) => set({ budgets: [...get().budgets, budget] }),
      // transac: { budget_idx, name, description, value, date, categories }
      addTransac: async (budget_idx, transac) =>
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === budget_idx
              ? {
                  ...budget,
                  transactions: [...budget.transactions, transac],
                }
              : budget;
          }),
        }),
      delTransac: async (budget_idx, tr_idx) =>
        set({
          budgets: get().budgets.map((budget, i) => {
            return i === budget_idx
              ? {
                  ...budget,
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
            console.debug([...budget.categories, cat, i, budget_idx]);
            return i === budget_idx
              ? {
                  ...budget,
                  categories: [...budget.categories, cat],
                }
              : budget;
          }),
        }),
      delCat: async (budget_idx, cat) =>
        set({
          budgets: get().budgets.map((budget, i) =>
            i === budget_idx
              ? {
                  ...budget,
                  categories: budget.categories.filter(
                    (_cat, _) => _cat !== cat
                  ),
                }
              : budget
          ),
        }),
      delBudget: async (idx) =>
        set({
          budgets: get().budgets.filter((_, i) => !(idx === i)),
        }),
    }),
    {
      name: "budgets3",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const Category = create(
  persist(
    (set, get) => ({
      categories: [],
      addCategory: async (category) =>
        set({ categories: [...get().categories, category] }),
    }),
    {
      name: "categories",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const Transaction = create(
  persist(
    (set, get) => ({
      transactions: [],
      addTransac: async (transaction) =>
        set({ transactions: [...get().transactions, transaction] }),
      delTransac: async (cfg) =>
        set({
          transactions: get().transactions.filter(
            (v, i) => cfg.bugdet_idx !== v.budget_idx && cfg.idx !== i
          ),
        }),
    }),
    {
      name: "transactions2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const Goals = create(
  persist(
    (set, get) => ({
      goals: [],
      addGoal: async (goal) => set({ goals: [...get().goals, goal] }),
      delGoal: async (cfg) =>
        set({
          goals: get().goals.filter(
            (v, i) => i !== cfg.idx && v.budget_idx !== cfg.budget_idx
          ),
        }),
    }),
    {
      name: "goals",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const AppSettings = create(
  persist(
    (set, get) => ({
      settings: {
        currency: {
          name: "USD",
          currencySymbol: "$",
          todollar: 1.0,
        },
      },
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { Budgets, Transaction, Category, Goals };