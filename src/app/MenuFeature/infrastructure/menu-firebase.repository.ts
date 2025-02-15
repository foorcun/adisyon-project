import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, remove, update } from '@angular/fire/database';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Menu } from '../domain/entity/menu.entity';
import { MenuMapper } from '../domain/entity/menu-mapper';

@Injectable({
    providedIn: 'root',
})
export class MenuFirebaseRepository {
    private basePath = 'menu';
    private menuSubject = new BehaviorSubject<Menu | null>(null);
    menu$ = this.menuSubject.asObservable();

    constructor(private database: Database) { }

    // Listen for changes in the menu
    listenForMenuChanges(menuKey: string) {
        const menuRef = ref(this.database, `${this.basePath}/${menuKey}`);
        onValue(menuRef, (snapshot) => {
            const menuData = snapshot.val();
            const transformedMenu = MenuMapper.toMenu(menuData);
            this.menuSubject.next(transformedMenu);
        });
    }

    // Add a new menu
    addMenu(menu: Menu): Observable<void> {
        const menuRef = ref(this.database, this.basePath);
        return from(push(menuRef, menu).then(() => { }));
    }

    // Remove a menu by key
    removeMenu(menuKey: string): Observable<void> {
        const menuRef = ref(this.database, `${this.basePath}/${menuKey}`);
        return from(remove(menuRef));
    }

    // Update a menu's name or other fields
    updateMenu(menuKey: string, updates: Partial<Menu>): Observable<void> {
        const menuRef = ref(this.database, `${this.basePath}/${menuKey}`);
        return from(update(menuRef, updates));
    }
}
