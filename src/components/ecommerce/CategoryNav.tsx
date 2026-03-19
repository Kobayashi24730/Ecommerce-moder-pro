import { categories } from "@/data/mockProducts";

const CategoryNav = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#"
              className="flex flex-col items-center gap-2 min-w-[72px] group"
            >
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-2xl shadow-sm border border-border group-hover:border-primary group-hover:shadow-md transition-all">
                {cat.icon}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center font-medium">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
