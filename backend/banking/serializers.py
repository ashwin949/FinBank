from rest_framework import serializers
from .models import Account, Transaction

class AccountSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = Account
        fields = [
            "id",
            "user",
            "user_name",
            "account_number",
            "balance",
            "created_at"
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
            "to_account",
            "transaction_type",
            "amount",
            "description",
            "created_at"
        ]

    def validate(self, data):

        account = data["account"]
        transaction_type = data["transaction_type"]
        amount = data["amount"]

        if amount <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )

        if transaction_type == "WITHDRAWAL":

            if account.balance < amount:
                raise serializers.ValidationError(
                    "Insufficient balance."
                )

        return data