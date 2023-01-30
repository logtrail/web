import Category from './category.type';

export type CategoriesState = {
  addingCategory: boolean;
  editingCategory: boolean;

  newCategory: Category;
  categoriesList: Category[];
};

export default CategoriesState;
