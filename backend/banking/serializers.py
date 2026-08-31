from rest_framework import serializers
from .models import Account, Transaction


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

def validate(self, data):

        account = data["account"]

        transaction_type = data["transaction_type"]

        amount = data["amount"]

        if transaction_type == "WITHDRAWAL":

            if account.balance < amount:

                raise serializers.ValidationError(

                    "Insufficient balance."

                )

        return data