package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Recipe.
 */
@Entity
@Table(name = "recipe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Recipe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "instructions", nullable = false)
    private String instructions;

    @NotNull
    @Min(value = 0)
    @Column(name = "nb_of_person", nullable = false)
    private Integer nbOfPerson;

    @NotNull
    @Column(name = "public_access", nullable = false)
    private Boolean publicAccess;

    @ManyToOne
    private User author;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "recipes" }, allowSetters = true)
    private Schedule schedule;

    @OneToMany(mappedBy = "recipe")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "recipe", "unit", "ingredient" }, allowSetters = true)
    private Set<RecipeIngredient> ingredients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Recipe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Recipe name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstructions() {
        return this.instructions;
    }

    public Recipe instructions(String instructions) {
        this.setInstructions(instructions);
        return this;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Integer getNbOfPerson() {
        return this.nbOfPerson;
    }

    public Recipe nbOfPerson(Integer nbOfPerson) {
        this.setNbOfPerson(nbOfPerson);
        return this;
    }

    public void setNbOfPerson(Integer nbOfPerson) {
        this.nbOfPerson = nbOfPerson;
    }

    public Boolean getPublicAccess() {
        return this.publicAccess;
    }

    public Recipe publicAccess(Boolean publicAccess) {
        this.setPublicAccess(publicAccess);
        return this;
    }

    public void setPublicAccess(Boolean publicAccess) {
        this.publicAccess = publicAccess;
    }

    public User getAuthor() {
        return this.author;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Recipe author(User user) {
        this.setAuthor(user);
        return this;
    }

    public Schedule getSchedule() {
        return this.schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Recipe schedule(Schedule schedule) {
        this.setSchedule(schedule);
        return this;
    }

    public Set<RecipeIngredient> getIngredients() {
        return this.ingredients;
    }

    public void setIngredients(Set<RecipeIngredient> recipeIngredients) {
        if (this.ingredients != null) {
            this.ingredients.forEach(i -> i.setRecipe(null));
        }
        if (recipeIngredients != null) {
            recipeIngredients.forEach(i -> i.setRecipe(this));
        }
        this.ingredients = recipeIngredients;
    }

    public Recipe ingredients(Set<RecipeIngredient> recipeIngredients) {
        this.setIngredients(recipeIngredients);
        return this;
    }

    public Recipe addIngredients(RecipeIngredient recipeIngredient) {
        this.ingredients.add(recipeIngredient);
        recipeIngredient.setRecipe(this);
        return this;
    }

    public Recipe removeIngredients(RecipeIngredient recipeIngredient) {
        this.ingredients.remove(recipeIngredient);
        recipeIngredient.setRecipe(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Recipe)) {
            return false;
        }
        return id != null && id.equals(((Recipe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Recipe{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", instructions='" + getInstructions() + "'" +
            ", nbOfPerson=" + getNbOfPerson() +
            ", publicAccess='" + getPublicAccess() + "'" +
            "}";
    }
}
