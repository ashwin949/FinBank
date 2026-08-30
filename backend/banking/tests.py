from django.test import TestCase
from django.contrib.auth.models import User
from .models import Account, Transaction
from rest_framework.test import APITestCase


class AccountModelTest(TestCase):

    def test_account_creation(self):
        user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

        account = Account.objects.create(
            user=user,
            account_number="10000002",
            balance=5000
        )

        self.assertEqual(account.account_number, "10000002")
        self.assertEqual(account.balance, 5000)
class TransactionModelTest(TestCase):

    def test_transaction_creation(self):
        user = User.objects.create_user(
            username="transactionuser",
            password="testpass123"
        )

        account = Account.objects.create(
            user=user,
            account_number="10000003",
            balance=5000
        )

        transaction = Transaction.objects.create(
            account=account,
            transaction_type="DEPOSIT",
            amount=1000,
            description="Test deposit"
        )

        self.assertEqual(transaction.transaction_type, "DEPOSIT")
        self.assertEqual(transaction.amount, 1000)
        self.assertEqual(transaction.account, account)
class AccountAPITest(APITestCase):

    def test_account_list_api(self):
        user = User.objects.create_user(
            username="apiuser",
            password="testpass123"
        )

        Account.objects.create(
            user=user,
            account_number="10000004",
            balance=7500
        )

        response = self.client.get("/api/accounts/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["account_number"], "10000004")
