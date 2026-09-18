from rest_framework import serializers
from .models import Account, Transaction


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = [
            "id",
            "user",
            "account_number",
            "balance",
        ]


class TransactionSerializer(serializers.ModelSerializer):

    to_account = serializers.SlugRelatedField(
        slug_field="account_number",
        queryset=Account.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "account",
            "transaction_type",
            "amount",
            "description",
            "to_account",
            "created_at",
        ]