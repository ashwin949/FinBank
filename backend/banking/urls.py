from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, TransactionViewSet

router = DefaultRouter()

router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = router.urls