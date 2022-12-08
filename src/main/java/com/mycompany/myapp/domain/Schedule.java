package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Meal;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Schedule.
 */
@Entity
@Table(name = "schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Schedule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "meal", nullable = false)
    private Meal meal;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "schedule")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author", "schedule", "ingredients" }, allowSetters = true)
    private Set<Recipe> recipes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Schedule id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Meal getMeal() {
        return this.meal;
    }

    public Schedule meal(Meal meal) {
        this.setMeal(meal);
        return this;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Schedule date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Schedule user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Recipe> getRecipes() {
        return this.recipes;
    }

    public void setRecipes(Set<Recipe> recipes) {
        if (this.recipes != null) {
            this.recipes.forEach(i -> i.setSchedule(null));
        }
        if (recipes != null) {
            recipes.forEach(i -> i.setSchedule(this));
        }
        this.recipes = recipes;
    }

    public Schedule recipes(Set<Recipe> recipes) {
        this.setRecipes(recipes);
        return this;
    }

    public Schedule addRecipe(Recipe recipe) {
        this.recipes.add(recipe);
        recipe.setSchedule(this);
        return this;
    }

    public Schedule removeRecipe(Recipe recipe) {
        this.recipes.remove(recipe);
        recipe.setSchedule(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Schedule)) {
            return false;
        }
        return id != null && id.equals(((Schedule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Schedule{" +
            "id=" + getId() +
            ", meal='" + getMeal() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
