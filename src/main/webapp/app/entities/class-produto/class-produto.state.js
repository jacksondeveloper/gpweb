(function() {
    'use strict';

    angular
        .module('gpwebApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('class-produto', {
            parent: 'entity',
            url: '/class-produto?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gpwebApp.classProduto.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/class-produto/class-produtos.html',
                    controller: 'ClassProdutoController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('classProduto');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('class-produto-detail', {
            parent: 'entity',
            url: '/class-produto/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'gpwebApp.classProduto.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/class-produto/class-produto-detail.html',
                    controller: 'ClassProdutoDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('classProduto');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ClassProduto', function($stateParams, ClassProduto) {
                    return ClassProduto.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('class-produto.new', {
            parent: 'class-produto',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/class-produto/class-produto-dialog.html',
                    controller: 'ClassProdutoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                cdClassProduto: null,
                                dsClassProduto: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('class-produto', null, { reload: true });
                }, function() {
                    $state.go('class-produto');
                });
            }]
        })
        .state('class-produto.edit', {
            parent: 'class-produto',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/class-produto/class-produto-dialog.html',
                    controller: 'ClassProdutoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ClassProduto', function(ClassProduto) {
                            return ClassProduto.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('class-produto', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('class-produto.delete', {
            parent: 'class-produto',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/class-produto/class-produto-delete-dialog.html',
                    controller: 'ClassProdutoDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ClassProduto', function(ClassProduto) {
                            return ClassProduto.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('class-produto', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();