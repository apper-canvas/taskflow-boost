import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import AllTasksCategoryButton from '@/components/molecules/AllTasksCategoryButton';
import CategoryButton from '@/components/molecules/CategoryButton';

const CategorySidebar = ({ categories, tasks, selectedCategory, onCategoryChange }) => {
  return (
    <Card className="h-fit">
      <Text as="h3" className="mb-4">Categories</Text>
      <div className="space-y-2">
        <AllTasksCategoryButton
          isSelected={selectedCategory === 'all'}
          onClick={() => onCategoryChange('all')}
          taskCount={tasks.length}
        />
        {categories.map(category => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={onCategoryChange}
            taskCount={tasks.filter(t => t.categoryId === category.id).length}
          />
        ))}
      </div>
    </Card>
  );
};

export default CategorySidebar;