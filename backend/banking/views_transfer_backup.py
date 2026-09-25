from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from django.db import transaction

from .models import Account, Transaction
from .serializers import AccountSerializer, TransactionSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        account = Account.objects.select_for_update().get(
            id=serializer.validated_data["account"].id
        )

        transaction_type = serializer.validated_data["transaction_type"]
        amount = serializer.validated_data["amount"]

        if amount <= 0:
            raise ValidationError("Amount must be greater than zero.")

        if transaction_type == "DEPOSIT":
            account.balance += amount

        elif transaction_type == "WITHDRAWAL":
            if account.balance < amount:
                raise ValidationError("Insufficient balance.")
            account.balance -= amount

        elif transaction_type == "TRANSFER":
            raise ValidationError(
                "Transfer functionality will be added in the next step."
            )

        account.save(update_fields=["balance"])

        serializer.save(account=account)
