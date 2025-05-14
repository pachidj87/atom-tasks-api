import 'reflect-metadata';
import { RepositoryService } from './repository.service';
import { NotFoundError } from 'routing-controllers';
import { getFirestore } from 'firebase-admin/firestore';

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('RepositoryService', () => {
  let repositoryService: RepositoryService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      collection: jest.fn(),
    };
    (getFirestore as jest.Mock).mockReturnValue(mockDb);
    repositoryService = new RepositoryService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Firestore database', () => {
    expect(repositoryService.getDb()).toBe(mockDb);
  });

  describe('getCollection', () => {
    it('should return all documents in a collection', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Doc1' }) },
        { id: '2', data: () => ({ name: 'Doc2' }) },
      ];
      const mockSnapshot = { docs: mockDocs };
      const mockCollection = { get: jest.fn().mockResolvedValue(mockSnapshot) };

      mockDb.collection.mockReturnValue(mockCollection);

      const result = await repositoryService.getCollection('testCollection');
      expect(result).toEqual([
        { id: '1', name: 'Doc1' },
        { id: '2', name: 'Doc2' },
      ]);
      expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    });
  });

  describe('getDocument', () => {
    it('should return a document by ID', async () => {
      const mockDoc = { id: '1', exists: true, data: () => ({ name: 'Doc1' }) };
      const mockDocRef = { get: jest.fn().mockResolvedValue(mockDoc) };

      mockDb.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await repositoryService.getDocument('testCollection', '1');
      expect(result).toEqual({ id: '1', name: 'Doc1' });
      expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    });

    it('should throw NotFoundError if document does not exist', async () => {
      const mockDoc = { exists: false };
      const mockDocRef = { get: jest.fn().mockResolvedValue(mockDoc) };

      mockDb.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      await expect(repositoryService.getDocument('testCollection', '1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('addDocument', () => {
    it('should add a document to a collection', async () => {
      const mockDocRef = { id: '1' };
      const mockCollection = { add: jest.fn().mockResolvedValue(mockDocRef) };

      mockDb.collection.mockReturnValue(mockCollection);

      const result = await repositoryService.addDocument('testCollection', { name: 'NewDoc' });
      expect(result).toEqual({ id: '1', name: 'NewDoc' });
      expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    });
  });

  describe('updateDocument', () => {
    it('should update a document by ID', async () => {
      const mockUpdatedDoc = { id: '1', data: () => ({ name: 'UpdatedDoc' }) };
      const mockDocRef = {
        update: jest.fn(),
        get: jest.fn().mockResolvedValue(mockUpdatedDoc),
      };

      mockDb.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await repositoryService.updateDocument('testCollection', '1', { name: 'UpdatedDoc' });
      expect(result).toEqual({ id: '1', name: 'UpdatedDoc' });
      expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by ID', async () => {
      const mockDocRef = { delete: jest.fn() };

      mockDb.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await repositoryService.deleteDocument('testCollection', '1');
      expect(result).toEqual({ id: '1', deleted: true });
      expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
    });
  });

  describe('queryCollection', () => {
    it('should query a collection with conditions', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Doc1' }) },
        { id: '2', data: () => ({ name: 'Doc2' }) },
      ];
      const mockSnapshot = { docs: mockDocs };
      const mockQueryRef = { get: jest.fn().mockResolvedValue(mockSnapshot), where: jest.fn().mockReturnThis() };

      mockDb.collection.mockReturnValue(mockQueryRef);

      const result = await repositoryService.queryCollection('testCollection', [['name', '==', 'Doc1']]);
      expect(result).toEqual([{ id: '1', name: 'Doc1' }, { id: '2', name: 'Doc2' }]);
      expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
      expect(mockQueryRef.where).toHaveBeenCalledWith('name', '==', 'Doc1');
    });
  });
});