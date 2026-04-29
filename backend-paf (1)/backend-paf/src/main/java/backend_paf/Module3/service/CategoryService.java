package backend_paf.Module3.service;

import backend_paf.Module3.model.Category;
import backend_paf.Module3.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(String name) {
        if (categoryRepository.findByName(name).isPresent()) {
            throw new RuntimeException("Category already exists");
        }
        return categoryRepository.save(new Category(name));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
