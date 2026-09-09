from django.db import transaction
from django.db.models import Q

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from .models import Account, Transaction
from .serializers import AccountSerializer, TransactionSerializer


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            Q(account__user=self.request.user) |
            Q(to_account__user=self.request.user)
        )

    @transaction.atomic
    def perform_create(self, serializer):

        transaction_type = serializer.validated_data["transaction_type"]
        amount = serializer.validated_data["amount"]

        account = Account.objects.select_for_update().get(
            id=serializer.validated_data["account"].id
        )

        if amount <= 0:
            raise ValidationError("Amount must be greater than zero.")

        if transaction_type == "DEPOSIT":

            account.balance += amount

            account.save(update_fields=["balance"])

            serializer.save()

        elif transaction_type == "WITHDRAWAL":

            if account.balance < amount:
                raise ValidationError("Insufficient balance.")

            account.balance -= amount

            account.save(update_fields=["balance"])

            serializer.save()

        elif transaction_type == "TRANSFER":

            to_account = serializer.validated_data.get("to_account")

            if not to_account:
                raise ValidationError(
                    "Receiver account is required for transfer."
                )

            if account.id == to_account.id:
                raise ValidationError(
                    "Cannot transfer money to the same account."
                )

            receiver = Account.objects.select_for_update().get(
                id=to_account.id
            )

            if account.balance < amount:
                raise ValidationError("Insufficient balance.")

            account.balance -= amount
            receiver.balance += amount

            account.save(update_fields=["balance"])
            receiver.save(update_fields=["balance"])

            serializer.save()

        else:
            raise ValidationError("Invalid transaction type.")