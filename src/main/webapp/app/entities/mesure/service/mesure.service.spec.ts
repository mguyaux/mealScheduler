import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMesure } from '../mesure.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mesure.test-samples';

import { MesureService } from './mesure.service';

const requireRestSample: IMesure = {
  ...sampleWithRequiredData,
};

describe('Mesure Service', () => {
  let service: MesureService;
  let httpMock: HttpTestingController;
  let expectedResult: IMesure | IMesure[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MesureService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Mesure', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mesure = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mesure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mesure', () => {
      const mesure = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mesure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mesure', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mesure', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mesure', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMesureToCollectionIfMissing', () => {
      it('should add a Mesure to an empty array', () => {
        const mesure: IMesure = sampleWithRequiredData;
        expectedResult = service.addMesureToCollectionIfMissing([], mesure);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mesure);
      });

      it('should not add a Mesure to an array that contains it', () => {
        const mesure: IMesure = sampleWithRequiredData;
        const mesureCollection: IMesure[] = [
          {
            ...mesure,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, mesure);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mesure to an array that doesn't contain it", () => {
        const mesure: IMesure = sampleWithRequiredData;
        const mesureCollection: IMesure[] = [sampleWithPartialData];
        expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, mesure);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mesure);
      });

      it('should add only unique Mesure to an array', () => {
        const mesureArray: IMesure[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mesureCollection: IMesure[] = [sampleWithRequiredData];
        expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, ...mesureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mesure: IMesure = sampleWithRequiredData;
        const mesure2: IMesure = sampleWithPartialData;
        expectedResult = service.addMesureToCollectionIfMissing([], mesure, mesure2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mesure);
        expect(expectedResult).toContain(mesure2);
      });

      it('should accept null and undefined values', () => {
        const mesure: IMesure = sampleWithRequiredData;
        expectedResult = service.addMesureToCollectionIfMissing([], null, mesure, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mesure);
      });

      it('should return initial array if no Mesure is added', () => {
        const mesureCollection: IMesure[] = [sampleWithRequiredData];
        expectedResult = service.addMesureToCollectionIfMissing(mesureCollection, undefined, null);
        expect(expectedResult).toEqual(mesureCollection);
      });
    });

    describe('compareMesure', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMesure(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMesure(entity1, entity2);
        const compareResult2 = service.compareMesure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMesure(entity1, entity2);
        const compareResult2 = service.compareMesure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMesure(entity1, entity2);
        const compareResult2 = service.compareMesure(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
