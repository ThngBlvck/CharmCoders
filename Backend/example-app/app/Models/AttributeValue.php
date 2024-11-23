<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    use HasFactory;

    protected $fillable = ['attribute_id', 'value'];

    // Mối quan hệ với Attribute: Mỗi AttributeValue chỉ thuộc về 1 Attribute
    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    // Mối quan hệ với VariantAttributeValue
    public function variantAttributeValues()
    {
        return $this->hasMany(VariantAttributeValue::class);
    }
}

