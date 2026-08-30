from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, TransactionViewSet

router = DefaultRouter()

router.register(r'accounts', AccountViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = router.urls