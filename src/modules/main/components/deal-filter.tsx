"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useStores } from "@/modules/store/hooks/use-store";
import { useListCategories } from "@/modules/category/hooks/use-category";
import { Loader2 } from "lucide-react";

type FilterType = string | null;
type MaxPriceType = number;
interface IDealContext {
  category: FilterType;
  setCategory: Dispatch<SetStateAction<FilterType>>;
  store: string[];
  setStore: Dispatch<SetStateAction<string[]>>;
  maxPrice: MaxPriceType;
  setMaxPrice: Dispatch<SetStateAction<MaxPriceType>>;
}

const PRICE_MIN = 0;
const PRICE_MAX = 9999999;

const DealFilterContext = createContext<IDealContext | undefined>(undefined);

const useDealFilterContextValues = () => {
  const values = useContext(DealFilterContext);
  if (!values) {
    throw new Error(
      "DealFilterContext must be used within a DealFilterProvider",
    );
  }
  return values;
};

const DealFilterProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<string | null>(null);
  const [store, setStore] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<MaxPriceType>(PRICE_MAX);

  return (
    <DealFilterContext.Provider
      value={{ category, setCategory, store, setStore, maxPrice, setMaxPrice }}
    >
      {children}
    </DealFilterContext.Provider>
  );
};

const CategoriesList = () => {
  const { category, setCategory } = useDealFilterContextValues();
  const { data, isPending, isError } = useListCategories();

  const categories = data?.items ?? [];

  return (
    <div className="flex flex-col gap-1 px-2">
      {isPending && (
        <div className="flex items-center justify-center p-2">
          <Loader2
            className="text-primary h-5 w-5 animate-spin"
            aria-label="Loading categories"
          />
        </div>
      )}
      {isError ? (
        <div>Error loading categories.</div>
      ) : (
        <>
          {categories.map((cat: { id: string; name: string }) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                checked={category === cat.id}
                onChange={() => setCategory(cat.id)}
                className="accent-primary"
                name="deal-category"
              />
              <span>{cat.name}</span>
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              checked={category === null}
              onChange={() => setCategory(null)}
              className="accent-primary"
              name="deal-category"
            />
            <span>All</span>
          </label>
        </>
      )}
    </div>
  );
};

const StoreList = () => {
  const { store, setStore } = useDealFilterContextValues();
  const { data, isPending, isError } = useStores();

  if (isPending)
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2
          className="text-primary h-6 w-6 animate-spin"
          aria-label="Loading stores"
        />
      </div>
    );
  if (isError) return <div>Error loading stores.</div>;

  const stores = data?.stores ?? [];

  const toggleStore = (storeId: string) => {
    setStore((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId],
    );
  };

  return (
    <div className="flex max-h-40 flex-col gap-1 overflow-auto px-2">
      {stores.map((s: { id: string; name: string }) => (
        <label key={s.id} className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={store.includes(s.id)}
            onChange={() => toggleStore(s.id)}
            className="accent-primary"
          />
          <span>{s.name}</span>
        </label>
      ))}
    </div>
  );
};

const MaxPriceSlider = () => {
  const { maxPrice, setMaxPrice } = useDealFilterContextValues();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
  };

  return (
    <div className="mt-4 flex flex-col gap-3 p-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-muted-foreground font-medium">PRICE RANGE</span>
      </div>
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={1}
        value={maxPrice}
        onChange={handleSliderChange}
        className="h-2 w-full accent-[#FF4333]"
        aria-label="Maximum price"
      />
      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="flex flex-1 justify-center">
          <div className="w-24 rounded-xl border border-[#434343] bg-[#1a1a1a] px-6 py-2 text-center text-lg font-medium text-white">
            0
          </div>
        </div>
        <span className="text-sm font-light text-gray-500 select-none">–</span>
        <div className="flex flex-1 justify-center">
          <div className="w-32 overflow-x-auto rounded-xl border border-[#434343] bg-[#1a1a1a] px-6 py-2 text-center text-sm font-medium text-white">
            ₹{maxPrice.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DealFilterSidebar = () => {
  const { setCategory, setStore, setMaxPrice } = useDealFilterContextValues();
  const resetFilter = () => {
    setCategory(null);
    setStore([]);
    setMaxPrice(PRICE_MAX);
  };
  return (
    <div className="sticky top-0 hidden h-fit gap-2 rounded-md border p-4 lg:flex lg:flex-col">
      <div className="flex w-full justify-between gap-4">
        <Heading className="text-shadow-sm" as="h4">
          Filters
        </Heading>
        <Button
          onClick={resetFilter}
          variant="outline"
          className="text-primary uppercase"
        >
          Clear All
        </Button>
      </div>
      <div>
        <Heading className="text-shadow-sm" as="h5">
          Categories
        </Heading>
        <CategoriesList />
      </div>
      <div>
        <Heading className="text-shadow-sm" as="h5">
          Store
        </Heading>
        <StoreList />
      </div>
      <div>
        <MaxPriceSlider />
      </div>
    </div>
  );
};

export { DealFilterProvider, useDealFilterContextValues, DealFilterSidebar };
