import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Directive({
    selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
    // the role the user must have
    @Input() appHasRole: string;

    stop$ = new Subject();

    isVisible = false;

    /**
     * @param {ViewContainerRef} viewContainerRef
     * 	-- the location where we need to render the templateRef
     * @param {TemplateRef<any>} templateRef
     *   -- the templateRef to be potentially rendered
     * @param {RolesService} rolesService
     *   -- will give us access to the roles a user has
     */
    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private auth: AuthService
    ) { }

    ngOnInit() {


        // If the user has the role needed to
        // render this component we can add it

        if (this.auth.hasRole(this.appHasRole)) {
            // If it is already visible (which can happen if
            // his roles changed) we do not need to add it a second time
            if (!this.isVisible) {
                // We update the `isVisible` property and add the
                // templateRef to the view using the
                // 'createEmbeddedView' method of the viewContainerRef
                this.isVisible = true;
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        } else {
            // If the user does not have the role,
            // we update the `isVisible` property and clear
            // the contents of the viewContainerRef
            this.isVisible = false;
            this.viewContainerRef.clear();
        }
    }
}
