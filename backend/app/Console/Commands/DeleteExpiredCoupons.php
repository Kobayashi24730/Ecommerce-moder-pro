<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:delete-expired-coupons')]
#[Description('Command description')]
class DeleteExpiredCoupons extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $delete = \App\Models\Coupon::whereDate('expire_date', '<', now()->toDateString())->delete();
        $this->info("Deleted $delete expired coupons.");
    }
}
