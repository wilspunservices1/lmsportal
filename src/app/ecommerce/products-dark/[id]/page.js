import ProductDetailsMain from "@/components/layout/main/ecommerce/ProductDetailsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import products from "@/../public/fakedata/products.json";
export const metadata = {
  title: "Product Details Dark | Meridian LMS - Education LMS Template",
  description: "Product Details Dark | Meridian LMS - Education LMS Template",
};

const Product_Details_Dark = async ({ params }) => {
  const { id } = params;
  const isExistProducts = products?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistProducts) {
    notFound();
  }
  return (
    <PageWrapper>
      <main className="is-dark">
        <ProductDetailsMain id={id} />
      </main>
    </PageWrapper>
  );
};
export async function generateStaticParams() {
  return products?.map(({ id }) => ({ id: id.toString() }));
}
export default Product_Details_Dark;
