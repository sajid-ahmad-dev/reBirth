import configPromise from "@payload-config";
import { getPayload } from "payload";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { SearchFilters } from "./search-filters";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, //populate subcatrgories
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = (data?.docs || []).map((doc) => ({
    ...doc,
    subcategories: (doc?.subcategories?.docs || []).map((sub) => ({
      ...(sub as Category),
      subcategories: undefined, // remove nested subcategories
    })),
  }));

  console.log({ data, formattedData });
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />

      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
