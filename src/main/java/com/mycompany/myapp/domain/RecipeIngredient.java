package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RecipeIngredient.
 */
@Entity
@Table(name = "recipe_ingredient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RecipeIngredient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "quantity", nullable = false)
    private Float quantity;

    @ManyToOne
    @JsonIgnoreProperties(value = { "author", "schedule", "ingredients" }, allowSetters = true)
    private Recipe recipe;

    @ManyToOne
    private Mesure unit;

    @ManyToOne
    private Ingredient ingredient;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RecipeIngredient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getQuantity() {
        return this.quantity;
    }

    public RecipeIngredient quantity(Float quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Float quantity) {
        this.quantity = quantity;
    }

    public Recipe getRecipe() {
        return this.recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public RecipeIngredient recipe(Recipe recipe) {
        this.setRecipe(recipe);
        return this;
    }

    public Mesure getUnit() {
        return this.unit;
    }

    public void setUnit(Mesure mesure) {
        this.unit = mesure;
    }

    public RecipeIngredient unit(Mesure mesure) {
        this.setUnit(mesure);
        return this;
    }

    public Ingredient getIngredient() {
        return this.ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public RecipeIngredient ingredient(Ingredient ingredient) {
        this.setIngredient(ingredient);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RecipeIngredient)) {
            return false;
        }
        return id != null && id.equals(((RecipeIngredient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RecipeIngredient{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            "}";
    }
}
