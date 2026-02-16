import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TreeService {
  constructor() {}

  /**
   * Найти родителя элемента в дереве по ID
   * @param tree массив элементов
   * @param childId id искомого дочернего элемента
   */
  findParent(tree: any[], childId: string) {
    for (const node of tree) {
      if (node.tests?.some((t: any) => t._id.toString() === childId)) {
        return node;
      }
      if (node.tests?.length) {
        const parent = this.findParent(node.tests, childId);
        if (parent) return parent;
      }
    }
    return null;
  }

  /**
   * Перемещает узел внутри дерева
   * @param tree массив корневых элементов
   * @param nodeToMove узел, который перемещаем
   * @param newParentId id нового родителя (null для корня)
   * @param newIndex позиция в массиве дочерних элементов нового родителя
   */
  moveNode(tree: any[], nodeToMove: any, newParentId: string | null, newIndex?: number) {
    // Удаляем nodeToMove из старого родителя
    const oldParent = this.findParent(tree, nodeToMove._id.toString());
    if (oldParent) {
      oldParent.tests = oldParent.tests.filter((t: any) => t._id.toString() !== nodeToMove._id.toString());
    } else {
      // Если родитель не найден, nodeToMove был в корне
      const index = tree.findIndex(t => t._id.toString() === nodeToMove._id.toString());
      if (index !== -1) tree.splice(index, 1);
    }

    // Если новый родитель null, добавляем в корень
    if (!newParentId) {
      if (newIndex !== undefined && newIndex >= 0 && newIndex <= tree.length) {
        tree.splice(newIndex, 0, nodeToMove);
      } else {
        tree.push(nodeToMove);
      }
      return;
    }

    // Иначе ищем нового родителя
    const newParent = this.findNode(tree, newParentId);
    if (!newParent) {
      throw new NotFoundException(`Parent node ${newParentId} not found`);
    }
    newParent.tests = newParent.tests || [];
    if (newIndex !== undefined && newIndex >= 0 && newIndex <= newParent.tests.length) {
      newParent.tests.splice(newIndex, 0, nodeToMove);
    } else {
      newParent.tests.push(nodeToMove);
    }
  }

  /**
   * Найти узел в дереве по ID
   * @param tree массив корневых элементов
   * @param nodeId id искомого узла
   */
  findNode(tree: any[], nodeId: string): any | null {
    for (const node of tree) {
      if (node._id.toString() === nodeId) return node;
      if (node.tests?.length) {
        const found = this.findNode(node.tests, nodeId);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Преобразовать дерево в плоский массив с учетом иерархии
   */
  flattenTree(tree: any[]): any[] {
    let result: any[] = [];
    for (const node of tree) {
      result.push(node);
      if (node.tests?.length) {
        result = result.concat(this.flattenTree(node.tests));
      }
    }
    return result;
  }
}