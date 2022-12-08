import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserInfo } from '../user-info.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-info.test-samples';

import { UserInfoService } from './user-info.service';

const requireRestSample: IUserInfo = {
  ...sampleWithRequiredData,
};

describe('UserInfo Service', () => {
  let service: UserInfoService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserInfo | IUserInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserInfoService);
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

    it('should create a UserInfo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userInfo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserInfo', () => {
      const userInfo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserInfo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserInfo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserInfo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserInfoToCollectionIfMissing', () => {
      it('should add a UserInfo to an empty array', () => {
        const userInfo: IUserInfo = sampleWithRequiredData;
        expectedResult = service.addUserInfoToCollectionIfMissing([], userInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userInfo);
      });

      it('should not add a UserInfo to an array that contains it', () => {
        const userInfo: IUserInfo = sampleWithRequiredData;
        const userInfoCollection: IUserInfo[] = [
          {
            ...userInfo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, userInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserInfo to an array that doesn't contain it", () => {
        const userInfo: IUserInfo = sampleWithRequiredData;
        const userInfoCollection: IUserInfo[] = [sampleWithPartialData];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, userInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userInfo);
      });

      it('should add only unique UserInfo to an array', () => {
        const userInfoArray: IUserInfo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userInfoCollection: IUserInfo[] = [sampleWithRequiredData];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, ...userInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userInfo: IUserInfo = sampleWithRequiredData;
        const userInfo2: IUserInfo = sampleWithPartialData;
        expectedResult = service.addUserInfoToCollectionIfMissing([], userInfo, userInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userInfo);
        expect(expectedResult).toContain(userInfo2);
      });

      it('should accept null and undefined values', () => {
        const userInfo: IUserInfo = sampleWithRequiredData;
        expectedResult = service.addUserInfoToCollectionIfMissing([], null, userInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userInfo);
      });

      it('should return initial array if no UserInfo is added', () => {
        const userInfoCollection: IUserInfo[] = [sampleWithRequiredData];
        expectedResult = service.addUserInfoToCollectionIfMissing(userInfoCollection, undefined, null);
        expect(expectedResult).toEqual(userInfoCollection);
      });
    });

    describe('compareUserInfo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserInfo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserInfo(entity1, entity2);
        const compareResult2 = service.compareUserInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserInfo(entity1, entity2);
        const compareResult2 = service.compareUserInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserInfo(entity1, entity2);
        const compareResult2 = service.compareUserInfo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
