package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Mesure;
import com.mycompany.myapp.repository.MesureRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MesureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MesureResourceIT {

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mesures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MesureRepository mesureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMesureMockMvc;

    private Mesure mesure;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mesure createEntity(EntityManager em) {
        Mesure mesure = new Mesure().symbol(DEFAULT_SYMBOL);
        return mesure;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mesure createUpdatedEntity(EntityManager em) {
        Mesure mesure = new Mesure().symbol(UPDATED_SYMBOL);
        return mesure;
    }

    @BeforeEach
    public void initTest() {
        mesure = createEntity(em);
    }

    @Test
    @Transactional
    void createMesure() throws Exception {
        int databaseSizeBeforeCreate = mesureRepository.findAll().size();
        // Create the Mesure
        restMesureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mesure)))
            .andExpect(status().isCreated());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeCreate + 1);
        Mesure testMesure = mesureList.get(mesureList.size() - 1);
        assertThat(testMesure.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
    }

    @Test
    @Transactional
    void createMesureWithExistingId() throws Exception {
        // Create the Mesure with an existing ID
        mesure.setId(1L);

        int databaseSizeBeforeCreate = mesureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMesureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mesure)))
            .andExpect(status().isBadRequest());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSymbolIsRequired() throws Exception {
        int databaseSizeBeforeTest = mesureRepository.findAll().size();
        // set the field null
        mesure.setSymbol(null);

        // Create the Mesure, which fails.

        restMesureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mesure)))
            .andExpect(status().isBadRequest());

        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMesures() throws Exception {
        // Initialize the database
        mesureRepository.saveAndFlush(mesure);

        // Get all the mesureList
        restMesureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mesure.getId().intValue())))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)));
    }

    @Test
    @Transactional
    void getMesure() throws Exception {
        // Initialize the database
        mesureRepository.saveAndFlush(mesure);

        // Get the mesure
        restMesureMockMvc
            .perform(get(ENTITY_API_URL_ID, mesure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mesure.getId().intValue()))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL));
    }

    @Test
    @Transactional
    void getNonExistingMesure() throws Exception {
        // Get the mesure
        restMesureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMesure() throws Exception {
        // Initialize the database
        mesureRepository.saveAndFlush(mesure);

        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();

        // Update the mesure
        Mesure updatedMesure = mesureRepository.findById(mesure.getId()).get();
        // Disconnect from session so that the updates on updatedMesure are not directly saved in db
        em.detach(updatedMesure);
        updatedMesure.symbol(UPDATED_SYMBOL);

        restMesureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMesure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMesure))
            )
            .andExpect(status().isOk());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
        Mesure testMesure = mesureList.get(mesureList.size() - 1);
        assertThat(testMesure.getSymbol()).isEqualTo(UPDATED_SYMBOL);
    }

    @Test
    @Transactional
    void putNonExistingMesure() throws Exception {
        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();
        mesure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMesureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mesure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mesure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMesure() throws Exception {
        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();
        mesure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMesureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mesure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMesure() throws Exception {
        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();
        mesure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMesureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mesure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMesureWithPatch() throws Exception {
        // Initialize the database
        mesureRepository.saveAndFlush(mesure);

        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();

        // Update the mesure using partial update
        Mesure partialUpdatedMesure = new Mesure();
        partialUpdatedMesure.setId(mesure.getId());

        restMesureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMesure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMesure))
            )
            .andExpect(status().isOk());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
        Mesure testMesure = mesureList.get(mesureList.size() - 1);
        assertThat(testMesure.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
    }

    @Test
    @Transactional
    void fullUpdateMesureWithPatch() throws Exception {
        // Initialize the database
        mesureRepository.saveAndFlush(mesure);

        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();

        // Update the mesure using partial update
        Mesure partialUpdatedMesure = new Mesure();
        partialUpdatedMesure.setId(mesure.getId());

        partialUpdatedMesure.symbol(UPDATED_SYMBOL);

        restMesureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMesure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMesure))
            )
            .andExpect(status().isOk());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
        Mesure testMesure = mesureList.get(mesureList.size() - 1);
        assertThat(testMesure.getSymbol()).isEqualTo(UPDATED_SYMBOL);
    }

    @Test
    @Transactional
    void patchNonExistingMesure() throws Exception {
        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();
        mesure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMesureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mesure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mesure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMesure() throws Exception {
        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();
        mesure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMesureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mesure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMesure() throws Exception {
        int databaseSizeBeforeUpdate = mesureRepository.findAll().size();
        mesure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMesureMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mesure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mesure in the database
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMesure() throws Exception {
        // Initialize the database
        mesureRepository.saveAndFlush(mesure);

        int databaseSizeBeforeDelete = mesureRepository.findAll().size();

        // Delete the mesure
        restMesureMockMvc
            .perform(delete(ENTITY_API_URL_ID, mesure.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mesure> mesureList = mesureRepository.findAll();
        assertThat(mesureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
