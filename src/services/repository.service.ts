import { Service } from 'typedi';
import { getFirestore } from 'firebase-admin/firestore';

import { NotFoundError } from 'routing-controllers';

@Service()
export class RepositoryService {
  private db: any;

  constructor() {
    this.db = getFirestore();
  }

  getDb() {
    return this.db;
  }

  async getCollection(collectionName: string) {
    const collectionRef = this.db.collection(collectionName);
    const snapshot = await collectionRef.get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  }

  async getDocument(collectionName: string, documentId: string) {
    const docRef = this.db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundError('Document not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async addDocument(collectionName: string, data: any) {
    const collectionRef = this.db.collection(collectionName);
    const docRef = await collectionRef.add({ ...data });
    return { id: docRef.id, ...data };
  }

  async updateDocument(collectionName: string, documentId: string, data: any) {
    const docRef = this.db.collection(collectionName).doc(documentId);
    await docRef.update({ ...data });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  async deleteDocument(collectionName: string, documentId: string) {
    const docRef = this.db.collection(collectionName).doc(documentId);
    await docRef.delete();
    return { id: documentId, deleted: true };
  }

  async queryCollection(collectionName: string, query: any) {
    const collectionRef = this.db.collection(collectionName);
    let queryRef = collectionRef;

    for (const [field, condition, value] of query) {
      queryRef = queryRef.where(field, condition, value);
    }

    const snapshot = await queryRef.get();
    const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));    
    return data;
  }
}